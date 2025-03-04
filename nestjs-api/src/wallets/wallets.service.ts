import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { Wallet } from './entities/wallet.entity';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { WalletAsset } from './entities/wallet-asset.entity';
import { Asset } from 'src/assets/entities/asset.entity';

@Injectable()
export class WalletsService {
  constructor(@InjectModel(Wallet.name) private walletSchema: Model<Wallet>,
    @InjectModel(WalletAsset.name) private walletAssetSchema: Model<WalletAsset>,
    @InjectConnection() private connection: mongoose.Connection) { }

  async create(createWalletDto: CreateWalletDto) {
    try {
      return await this.walletSchema.create(createWalletDto);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Houve um erro ao criar a wallet.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    const existingWallets = await this.walletSchema.find().populate([{ path: 'assets', populate: ['asset'] }]) as (Wallet & { assets: (WalletAsset & { asset: Asset })[] })[];
    if (!existingWallets.length) {
      throw new HttpException('Nenhuma wallet encontrada.', HttpStatus.NOT_FOUND);
    }
    return existingWallets;
  }

  findOne(id: string) {
    console.log(id);
    const existingWallet = this.walletSchema.findById(id).populate([
      { path: 'assets', populate: [ 'asset' ] }
    ]) as Promise<(Wallet & { assets: (WalletAsset & { asset: Asset })[] }) | null>;
    return existingWallet;

  }

  async createWalletAsset(data:{
    walletId: string;
    assetId: string;
    shares: number;
  }) {
    const existingWalletAsset = await this.walletAssetSchema.findOne({
      wallet: data.walletId,
      asset: data.assetId,
    });
    if (existingWalletAsset) {
      throw new HttpException(
        'Já existe outra wallet com o id e ativo informados.',
        HttpStatus.CONFLICT
      );
    }
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      const docs = await this.walletAssetSchema.create(
        [{
          wallet: data.walletId,
          asset: data.assetId,
          shares: data.shares
        }],
        {
          session
        });
      const walletAsset = docs[0];
      await this.walletSchema.updateOne({ _id: data.walletId }, { $push: { assets: walletAsset._id } }, { session });
      await session.commitTransaction();
      return walletAsset;
    } catch (err) {
      console.log(err);
      await session.abortTransaction();
      throw new HttpException(
        'Houve um erro ao criar a wallet-asset.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } finally {
      await session.endSession();
    }

  }
}
