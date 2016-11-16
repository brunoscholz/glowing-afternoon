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
  description: string;
  imageHashes: string;
  keywords: string;
  itemCondition: string;
  createdAt: string;
  updatedAt: string;
  status: string;
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

export interface ISeller {
  sellerId: string;
  user: IUser;
  picture: IPicture;
  about: string;
  name: string;
  email: string;
  website: string;
  hours: string;
  categories: string;
  paymentOptions: string;
  createdAt: string;
  updatedAt: string;
  status: string;
}

export interface IBuyer {
  buyerId: string;
  user: IUser;
  picture: IPicture;
  about: string;
  dob: string;
  name: string;
  gender: string;
  email: string;
  title: string;
  website: string;
  coinsBalance: number;
  createdAt: string;
  updatedAt: string;
  status: string;
}

export interface IUser {
  userId: string;
  username: string;
  email: string;
  lastLogin: string;
  role: string;
  palette: string;
  visibility: string;
  createdAt: string;
  updatedAt: string;
  status: string;
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

export interface IReviewFact {
  reviewFactId: string;
  data: IReview;
  offer: IOffer;
  grades: void[];
  rating: number;
}

export interface IReview {
  reviewId: string;
  title: string;
  body: string;
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
  buyer: IBuyer;
  action: IAction;
  ruleId: string;
  points: number;
  status: string;
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