export interface ICategory {
  categoryId: string;
  parentId: string;
  name: string;
  description: string;
  icon: string;
}

export interface IOffer {
  offerId: string;
  itemId: number;
  sellerId: string;
  policyId: string;
  shippingId: string;
  pricePerUnit: number;
  discountPerUnit: number;
  description: string;
  imageHashes: string;
  keywords: string;
  condition: string;
  status: string;
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

export interface IUser {
  id: number,
  gender: string,
  name: { title: string, first: string, last: string },
  location: { street: string, city: string, state: string, postcode: string },
  email: string,
  login: { username: string, password: string, salt: string, md5: string, sha1: string, sha256: string },
  dob: string,
  registered: string,
  phone: string,
  cell: string,
  picture: { cover: string, large: string, medium: string, thumbnail: string },
  nat: string,
  coins: { balance: number }
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