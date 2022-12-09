import React from "react";
import { BsStar } from "react-icons/bs";
import ReviewCard from "./ReviewCard";

export interface review {
  avatar: string;
  username: string;
  stars: number;
  postedTime: Date;
  comments: string;
}

const reviews: review[] = [
  {
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIJF7LAdiF7JlRs24nLsBKz7nWamkcdXPODQ&usqp=CAU",
    username: "Ayomiku John",
    stars: 5,
    postedTime: new Date(),
    comments:
      "Vestibulum ac diam sit amet quam vehicula elementum sed sit amet  dui. Pellentesque in ipsum id orci porta dapibus. Proin eget  tortor risus. Vivamus suscipit tortor eget felis porttitor,  tortor risus. Vivamus suscipit tortor eget felis porttitor",
  },
  {
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIJF7LAdiF7JlRs24nLsBKz7nWamkcdXPODQ&usqp=CAU",
    username: "Olatunji Ayomiku",
    stars: 5,
    postedTime: new Date(),
    comments:
      "Vestibulum ac diam sit amet quam vehicula elementum sed sit amet  dui. Pellentesque in ipsum id orci porta dapibus. Proin eget  tortor risus. Vivamus suscipit tortor eget felis porttitor,  tortor risus. Vivamus suscipit tortor eget felis porttitor",
  },
  {
    avatar:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTIJF7LAdiF7JlRs24nLsBKz7nWamkcdXPODQ&usqp=CAU",
    username: "John Olatunji",
    stars: 5,
    postedTime: new Date(),
    comments:
      "Vestibulum ac diam sit amet quam vehicula elementum sed sit amet  dui. Pellentesque in ipsum id orci porta dapibus. Proin eget  tortor risus. Vivamus suscipit tortor eget felis porttitor,  tortor risus. Vivamus suscipit tortor eget felis porttitor",
  },
];

export default function CustomerReviews() {
  return (
    <div>
      <div className="flex space-x-14 justify-between">
        <div className="reviews px-2.5 -mt-2 w-[60%]">
          <h1 className="font-extrabold text-3xl text-black mb-3">
            Customers Reviews
          </h1>
          <hr />
          <div>
            {reviews.map((review: review, index) => (
              <ReviewCard key={index} review={review} />
            ))}
          </div>
        </div>
        <div className="write-a-review w-[30%]">
          <h1 className="font-extrabold text-3xl text-black">Write a Review</h1>
          <div className="flex justify-between mt-10 items-center">
            <h2 className="font-extrabold text-black text-xl">Rate us</h2>
            <div className="flex space-x-4">
              {[1, 2, 3, 4, 5].map((_, index) => (
                <BsStar className="mr-[-2px] cursor-pointer  text-[1rem]" />
              ))}
            </div>
          </div>
          <form action="" className="w-full mt-10">
            <div className="my-5 w-full">
              <input
                type="text"
                placeholder="Name"
                className="border-[1px] border-[gray] w-full py-3 px-2 hover:border-gray-400"
              />
            </div>
            <div>
              <input
                type="text"
                placeholder="Email"
                className="border-[1px] border-[gray] w-full py-3 px-2 hover:border-gray-400"
              />
            </div>
            <div className="mt-5">
              <textarea
                className="border-[1px] border-[gray] w-full py-3 px-2 hover:border-gray-400"
                id=""
                cols={30}
                rows={10}
                placeholder="Your review"
              />
            </div>
            <button className="text-white bg-black block w-full py-4 px-2 mt-2 rounded-md">
              Post a review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
