'use client';

import Slider from 'react-slick';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

// Data for your events
const events = [
  { id: 1, title: 'Blood Donation Drive', date: 'October 20, 2025', description: 'Join us to help save lives at our annual blood drive.' },
  { id: 2, title: 'Diabetes Awareness Workshop', date: 'November 5, 2025', description: 'Learn about prevention and management from our endocrinology experts.' },
  { id: 3, title: 'Free Health Screening', date: 'November 18, 2025', description: 'Get a free check-up including blood pressure and cholesterol.' },
  { id: 4, title: 'Medical Career Fair', date: 'December 2, 2025', description: 'Explore career opportunities with our hospital team.' },
];

export default function EventsCarousel() {
  const settings = {
    dots: true,
    infinite: true, // This enables the circular looping
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true, // This enables the automatic movement
    autoplaySpeed: 3000, // This sets the time between slides (3 seconds)
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
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Upcoming Events</h2>
      <Slider {...settings}>
        {events.map(event => (
          <div key={event.id} className="p-2">
            <div className="bg-white rounded-lg shadow-md p-6 h-full flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4">{event.description}</p>
              </div>
              <div className="text-sm text-blue-600 font-bold">{event.date}</div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}