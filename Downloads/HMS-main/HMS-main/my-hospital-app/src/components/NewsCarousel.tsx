'use client';

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// Data for your news articles
const newsArticles = [
  { id: 1, title: 'New Pediatric Wing Opened', date: 'October 15, 2025', description: 'We are proud to announce the opening of our new wing dedicated to pediatric care.' },
  { id: 2, title: 'Community Health Check-up', date: 'October 10, 2025', description: 'Join us this weekend for a free community health check-up event with our doctors.' },
  { id: 3, title: 'Medical Career Fair', date: 'September 28, 2025', description: 'Explore career opportunities with our hospital team and meet our staff.' },
  { id: 4, title: 'Hospital Receives National Award', date: 'September 20, 2025', description: 'Our hospital has been recognized for excellence in patient care and safety.' },
];

export default function NewsCarousel() {
  const settings = {
    dots: true,
    infinite: true, // This enables the circular looping
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true, // This enables the automatic movement
    autoplaySpeed: 4000, // This sets the time between slides (4 seconds)
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      }
    ]
  };

  return (
    <div className="container mx-auto py-4 px-2">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Latest News</h2>
      <Slider {...settings}>
        {newsArticles.map(article => (
          <div key={article.id} className="p-2">
            <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                <p className="text-gray-600 mb-4">{article.description}</p>
              </div>
              <div className="text-sm text-blue-600 font-bold">{article.date}</div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}