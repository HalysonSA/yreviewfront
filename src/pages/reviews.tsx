import { useEffect, useState } from "react";
import axios from "./api/axios";
import Link from "next/link";

interface Review {
  id: number;
  title: string;
  description: string;
  rating: number;
  created_at: string;
  updated_at: string;
  images: {
    id: number;
    url: string;
    created_at: string;
    updated_at: string;
  }[];
}

const Reviews = () => {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const getReviews = async () => {
      const reviews = await axios.get("/review");
      setReviews(reviews.data.data);
    };
    getReviews();
  }, []);

  return (
    <div>
      <Link href='/'>Home</Link>
      <h1>Reviews</h1>
      {reviews.map((review: Review) => (
        <div key={review.id}>
          <h2>{review.title}</h2>
          <p>{review.description}</p>
          <p>{review.rating}</p>
          <p>{review.created_at}</p>
          <p>{review.updated_at}</p>
          <div className='flex flex-row items-start'>
            {review.images.map((image) => (
              <img
                key={image.id}
                src={image.url}
                alt={review.title}
                className='w-12 h-12'
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
export default Reviews;
