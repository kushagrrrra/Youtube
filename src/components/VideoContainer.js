import React, { useEffect, useState } from "react";
import { YOUTUBE_VIDEOS_API } from "../utils/contants";
import VideoCard, { AdVideoCard } from "./VideoCard";
import { Link } from "react-router-dom";

const VideoContainer = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getVideos();
  }, []);

  const getVideos = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Fetching from URL:", YOUTUBE_VIDEOS_API);
      
      const data = await fetch(YOUTUBE_VIDEOS_API, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      console.log("Response status:", data.status);
      
      if (!data.ok) {
        const errorData = await data.json();
        console.error("API Error Response:", errorData);
        throw new Error(errorData.error?.message || 'Failed to fetch videos');
      }
      
      const json = await data.json();
      console.log("API Response:", json);
      
      if (!json.items || !Array.isArray(json.items)) {
        console.error("Invalid response format:", json);
        throw new Error('Invalid response format from YouTube API');
      }
      
      setVideos(json.items);
    } catch (err) {
      console.error("Detailed error:", {
        message: err.message,
        stack: err.stack,
        name: err.name
      });
      
      if (err.message.includes('API key')) {
        setError("YouTube API key error. Please check the configuration.");
      } else if (err.message.includes('quota')) {
        setError("YouTube API quota exceeded. Please try again later.");
      } else {
        setError(`Failed to load videos: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={getVideos}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500">No videos found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap">
      {videos.length > 0 && <AdVideoCard info={videos[0]} />}
      {videos.map((video) => (
        <Link key={video.id} to={"/watch?v=" + video.id}>
          <VideoCard info={video} />
        </Link>
      ))}
    </div>
  );
};

export default VideoContainer;