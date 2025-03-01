package entity

type Investor struct {
	ID            string
	Name          string
	AssetPosition []*InvestoAssetPosition
}

type InvestoAssetPosition struct {
	AssetID string
	Shares  int
}

func NewInvestor(id string) *Investor {
	return &Investor{
		ID:            id,
		AssetPosition: []*InvestoAssetPosition{},
	}
}

func (i *Investor) AddAssetPosition(assetPosition *InvestoAssetPosition) {
	i.AssetPosition = append(i.AssetPosition, assetPosition)
}

func (i *Investor) AdjustAssetPosition(assetID string, qtdShares int) {
	assetPosition := i.GetAssetPosition(assetID)
	if assetPosition == nil {
		i.AssetPosition = append(i.AssetPosition, NewInvestorAssetPosition(assetID, qtdShares))
	} else {
		assetPosition.AddShares(qtdShares)
	}
}

func (i *Investor) GetAssetPosition(assetID string) *InvestoAssetPosition {
	for _, assetPosition := range i.AssetPosition {
		if assetPosition.AssetID == assetID {
			return assetPosition
		}
	}
	return nil
}

func NewInvestorAssetPosition(assetID string, shares int) *InvestoAssetPosition {
	return &InvestoAssetPosition{
		AssetID: assetID,
		Shares:  shares,
	}
}

func (iap *InvestoAssetPosition) AddShares(qtd int) {
	iap.Shares += qtd
}
