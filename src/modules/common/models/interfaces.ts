export interface IPage {
  title: string;
  component: any;
  icon: string;
  index?: number;
  logsOut?: boolean;
  role?: string;
  passRoot?: boolean;
}

export interface ISearchResult { 
  title: string;
  list: any[];
  icon: string;
  showDetails: boolean;
}

export interface ISearchItems { 
  offers: ISearchResult;
  sellers: ISearchResult;
  buyers: ISearchResult;
}

export interface IProfile {
  id: string;
  bgImage: string;
  type: string;
  name: string;
  username: string;
  picture: IPicture;
}

export interface IShare {
  id: string;
  name: string;
  quote: string;
  caption: string;
  description: string;
  picture: string;
}

export interface ICategory {
  categoryId: string;
  parentId: string;
  name: string;
  description: string;
  icon: string;
}

export interface IPicture {
  pictureId: string;
  cover: string;
  large: string;
  medium: string;
  thumbnail: string;
  status: string;
}

export interface IOffer {
  offerId: string;
  item: IItem;
  seller: ISeller;
  policy: IPolicy;
  shipping: IShipping;
  picture: IPicture;
  pricePerUnit: number;
  discountPerUnit: number;
  vouchersHash: string;
  description: string;
  imageHashes: string;
  keywords: string;
  itemCondition: string;
  coinPrice: number;
  createdAt: string;
  updatedAt: string;
  status: string;
  vouchers: string;
  reviews: IReviewFact[];
  avgRating: IAvgRating;
}

export interface IVoucherFact {
  voucherFactId: string;
  voucherId: string;
  offerId: string;
  sellerId: string;
  date: string;
  status: string;
  voucher: IVoucher;
  offer: IOffer;
  seller: ISeller;
}

export interface IVoucher {
  voucherId: string;
  code: string;
  discount: number;
  expire: string;
  count: number;
}

export interface IAvgRating {
  qtd: number;
  avg: number;
}

export interface IItem {
  itemId: string;
  category: ICategory;
  sku: string;
  description: string;
  title: string;
  keywords: string;
  photoSrc: string;
  status: string;
}

export interface IUser {
  userId: string;
  buyer: IBuyer;
  sellers: ISeller[];
  username: string;
  email: string;
  lastLogin: string;
  role: string;
  palette: string;
  visibility: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  preferred: IProfile;
}

export interface ISeller {
  sellerId: string;
  userId: string;
  picture: IPicture;
  about: string;
  name: string;
  email: string;
  website: string;
  phone: string;
  cellphone: string;
  hours: string;
  categories: string;
  paymentOptions: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  licenseId: string;
  billingAddress: IBillingAddress;
  reviews: IReviewFact[];
  followers: IFollowFact[];
  license: number;
  distance: number;
  rating: IAvgRating;
}

export interface IBuyer {
  buyerId: string;
  picture: IPicture;
  about: string;
  dob: string;
  name: string;
  username: string;
  gender: string;
  email: string;
  title: string;
  website: string;
  coinsBalance: number;
  createdAt: string;
  updatedAt: string;
  status: string;
  loyalties: ILoyalty[];
  reviews: IReviewFact[];
  followers: IFollowFact[];
  following: IFollowFact[];
  favorites: IFavoriteFact[];
}

// can follow a business or another user
export interface IFollowFact {
  followFactId: string;
  actionReference: IActionReference;
  user: IBuyer;
  buyer: IBuyer;
  seller: ISeller;
  status: string;
}

// can add a product into favs list
export interface IFavoriteFact {
  favoriteFactId: string;
  actionReference: IActionReference;
  buyer: IBuyer;
  offer: IOffer;
  status: string;
}

// can review a business or an offer
export interface IReviewFact {
  reviewFactId: string;
  actionReference: IActionReference;
  buyer: IBuyer;
  review: IReview;
  offer: IOffer;
  seller: ISeller;
  date: string;
  rating: IRating;
}

export interface IReview {
  reviewId: string;
  title: string;
  body: string;
}

export interface IPolicy {
  policyId: string;
  description: string;
  terms: string;
  returns: string;
}

export interface IShipping {
  shippingId: string;
  regions: string;
  estimateDelivery: string;
  origins: string;
  fee: number;
  free: boolean;
}

export interface IShippingAddress {
  shippingAddressId: string;
  address: string;
  streetNumber: string;
  formattedAddress: string;
  city: string;
  state: string;
  neighborhood: string;
  postCode: string;
  country: string;
  latitude: number;
  longitude: number;
  status: string;
}

export interface IBillingAddress {
  billingAddressId: string;
  address: string;
  streetNumber: string;
  formattedAddress: string;
  city: string;
  state: string;
  neighborhood: string;
  postCode: string;
  country: string;
  latitude: number;
  longitude: number;
  status: string;
}

export interface IRating {
  grade: number;
  attendance: number;
  price: number;
}

export interface ICommentFact {
  commentFactId: string;
  data: IComment;
  action: IAction;
  review: IReviewFact;
}

export interface IComment {
  commentId: string;
  message: string;
  parent: string;
  status: string;
}

export interface IRelationship {
  relationshipId: string;
  reference: IReference;
  loyalty: ILoyalty;
  offer: IOffer;
  seller: ISeller;
  buyer: IBuyer;
  date: string;
  shippingAddress: string;
}

export interface ILoyalty {
  loyaltyId: string;
  transaction: ITransaction;
  user: IUser;
  action: IAction;
  ruleId: string;
  points: number;
  status: string;
}

export interface IBalance {
  USD: number;
  COIN: number;
  CRED: number;
  BRL: number;
  SALE: number;
}

export interface ITransaction {
  transactionId: string;
  relationship: IRelationship;
  type: string;
  sender: IUser;
  recipient: IUser;
  token: IToken;
  senderPublicKey: string;
  amount: number;
  fee: number;
  timestamp: string;
  signature: string;
}

export interface IReference {
  referenceId: string;
  relationship: IRelationship;
  quantity: number;
  cost: number;
  price: number;
}

export interface IToken {
  tokenId: string;
  name: string;
  description: string;
  fund: string;
  expirationPeriod: string;
}

export interface IAction {
  actionId: string;
  actionReference: IActionReference;
  follow: string;
  comment: ICommentFact;
  review: IReviewFact;
  loyalty: ILoyalty;
}

export interface IActionReference {
  actionReferenceId: string;
  actionGroup: string;
  actionType: string;
  actionOrder: number;
}

export interface IDate {
  date: string;
  name: string;
}

export interface ICustomer {
	id: number;
	firstName: string;
	lastName: string;
	gender: string;
	address: string;
	city: string;
	state: IState;
	orderTotal?: number;
}

export interface IState {
	abbreviation: string;
	name: string;
}

export interface IOrder {
	customerId: number;
	orderItems: IOrderItem[];
}

export interface IOrderItem {
	id: number;
	productName: string;
	itemCost: number;
}