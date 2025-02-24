import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAssetDto } from './dto/create-asset.dto';
import { Model } from 'mongoose';
import { Asset } from './entities/asset.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AssetsService {
  constructor(@InjectModel(Asset.name) private assetSchema: Model<Asset>) { }

  async create(createAssetDto: CreateAssetDto) {
    const existingAsset = await this.assetSchema.findOne({
      symbol: createAssetDto.symbol,
    });
    if (existingAsset) {
      throw new HttpException('Ativo já cadastrado', HttpStatus.CONFLICT);
    }
    try {
      return await this.assetSchema.create(createAssetDto);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Houve um erro ao criar o ativo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  
  async createRange(createAssetDto: CreateAssetDto[]) {
    for (const assetDto of createAssetDto) {
      const existingAsset = await this.assetSchema.findOne({
        symbol: assetDto.symbol,
      });
      if (existingAsset) {
        throw new HttpException(`Ativo ${assetDto.symbol} já cadastrado`, HttpStatus.CONFLICT);
      }
    }
    try {
      return await this.assetSchema.insertMany(createAssetDto);
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Houve um erro ao criar os ativos',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll() {
    const existingAssets = await this.assetSchema.find();
    if (!existingAssets) {
      throw new HttpException('Nenhum ativo encontrado', HttpStatus.NOT_FOUND);
    }
    return existingAssets;
  }

  async findOne(symbol: string) {
    const existingAsset = await this.assetSchema.findOne({ symbol });
    if (!existingAsset) {
      throw new HttpException(
        'Não foi encontrado um Asset com o símbolo informado.', 
        HttpStatus.NOT_FOUND
      );
    }
    return existingAsset;
  }
}
