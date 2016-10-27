export interface IOid {
  $oid: string;
}

export interface IAction {
  _id: IOid;
  id: number;
  type: string;
  name: string;
  code: string;
}

export interface IGrade {
  _id: IOid;
  id: number;
  fields: void[];
}

export interface ICategory {
  _id: IOid;
  code: number;
  parent: string;
  name: string;
  description: string;
  photoSrc: string;
}

export interface IProduct {
  _id: IOid;
  code: number;
  name: string;
  description: string;
  brand: string;
  gradeType: string;
  photoSrc: string;
}

export interface IReview {
  _id: IOid;
  code: number;
  title: string;
  body: string;
}

export interface IComment {
  _id: IOid;
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
  _id: IOid;
  categoryId: IOid;
  productId: IOid;
  avgPrice: number;
  avgRating: number;
  quality: number;
  fame: number;
  data: IProduct;
}

export interface IReviewFact {
  _id: IOid;
  productId: IOid;
  reviewId: IOid;
  grades: void[];
  rating: number;
  data: IReview;
}

export interface ISocialFact {
  _id: IOid;
  reviewId: IOid;
  commentId: IOid;
  /*
  like, upvote, fav
  */
}

export interface ITransaction {
  _id: IOid;
  actionId: IOid;
  userId: IOid;
  dateId: IOid;
  factId: IOid;
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