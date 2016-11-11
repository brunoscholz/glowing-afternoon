export interface ICategory {
  categoryId: string;
  parentId: string;
  name: string;
  description: string;
  icon: string;
}

export interface IOffer {
  offerId: string;
  item: IItem;
  seller: ISeller;
  policy: IPolicy;
  shipping: IShipping;
  pricePerUnit: number;
  discountPerUnit: number;
  description: string;
  imageHashes: string;
  keywords: string;
  condition: string;
  status: string;
}

export interface IItem {
  itemId: string;
  sku: string;
  category: ICategory;
  description: string;
  title: string;
  keywords: string;
  photoSrc: string;
  status: string;
}

export interface ISeller {
  sellerId: string;
  userId: string;
  about: string;
  name: string;
  email: string;
  website: string;
  picture: { cover: string, large: string, medium: string, thumbnail: string };
  facebookSocialId: string;
  twitterSocialId: string;
  instagramSocialId: string;
  snapchatSocialId: string;
  linkedinSocialId: string;
  githubSocialId: string;
  url_youtube: string;
  hours: string;
  categories: string;
  paymentOptions: string;
}

export interface IBuyer {
  buyerId: string;
  userId: string;
  about: string;
  dob: string;
  name: string;
  gender: string;
  email: string;
  title: string;
  website: string;
  picture: { cover: string, large: string, medium: string, thumbnail: string };
  coinsBalance: number;
  facebookSocialId: string;
  twitterSocialId: string;
  instagramSocialId: string;
  snapchatSocialId: string;
  linkedinSocialId: string;
  githubSocialId: string;
  url_youtube: string;
}

export interface IUser {
  userId: string;
  username: string;
  email: string;
  seller: Array<ISeller>;
  buyer: IBuyer;
  picture: { cover: string, large: string, medium: string, thumbnail: string };
  coins: { balance: number };
}

export interface IPolicy {
  policyId: string;
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

export interface IAction {
  _id: string;
  id: number;
  type: string;
  name: string;
  code: string;
}

export interface IGrade {
  _id: string;
  id: number;
  fields: void[];
}

export interface IProduct {
  _id: string;
  code: number;
  name: string;
  description: string;
  brand: string;
  gradeType: string;
  photoSrc: string;
}

export interface IReview {
  _id: string;
  code: number;
  title: string;
  body: string;
}

export interface IComment {
  _id: string;
  code: number;
  body: string;
}

export interface IRelationship {
  _id: string;
  actionId: number;
  categoryId: number;
  reviewId: number;
  commentId: number;
  dateId: number;
  geographyId: number;
  profileId: number;
}

export interface IProductFact {
  _id: string;
  categoryId: string;
  productId: string;
  avgPrice: number;
  avgRating: number;
  quality: number;
  fame: number;
  data: IProduct;
}

export interface IReviewFact {
  _id: string;
  productId: string;
  reviewId: string;
  grades: void[];
  rating: number;
  data: IReview;
}

export interface ISocialFact {
  _id: string;
  reviewId: string;
  commentId: string;
  /*
  like, upvote, fav
  */
}

export interface ITransaction {
  _id: string;
  actionId: string;
  userId: string;
  dateId: string;
  factId: string;
}

//export interface IDate
//export interface ILocation


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