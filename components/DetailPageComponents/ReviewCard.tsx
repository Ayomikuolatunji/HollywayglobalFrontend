import React from "react";
import { BsStarFill } from "react-icons/bs";
import { review } from "./CustomerReviews";

interface ReviewCardProps {
  review: review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  return (
    <div className="flex gap-10 mt-10">
      <div className="review-img w-[20%] flex justify-center flex-col">
        <img src={review.avatar} alt={review.username} className="w-24 h-24 rounded-full" />
        <h1 className="text-lg">{review.username}</h1>
      </div>
      <div className="review-details w-[80%]">
        <div className="w-full flex justify-between items-center gap-2 mb-8">
          <div>
            <h1 className="text-black font-bold text-lg">Excellent</h1>
            <div className="flex space-x-4 mt-5">
              {[1, 2, 3, 4, 5].map((_, index) => (
                <BsStarFill className="mr-[-2px] text-yellow-500  cursor-pointer  text-[1rem]" />
              ))}
            </div>
          </div>
          {review.postedTime.toDateString()}
        </div>
        <p>{review.comments}</p>
      </div>
    </div>
  );
}
