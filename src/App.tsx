// App.tsx
import VideoPlayer from "./components/video-components/VideoPlayer";

const mockChapters = [
  { id: 1, title: "Introduction & Course Overview", startTime: 0, endTime: 14 },
  {
    id: 2,
    title: "Curiosity's Role in Critical & Creative Thinking",
    startTime: 15,
    endTime: 57,
  },
  {
    id: 3,
    title: "Analytical vs Creative Thinking Explained",
    startTime: 58,
    endTime: 116,
  },
  {
    id: 4,
    title: "Building Your Bank of Dots",
    startTime: 117,
    endTime: 138,
  },
  {
    id: 5,
    title: "Practical Strategies to Stay Curious",
    startTime: 139,
    endTime: 225,
  },
  { id: 6, title: "Benefits of Curiosity", startTime: 226, endTime: 312 },
  { id: 7, title: "Conclusion & Recap", startTime: 313, endTime: 348 },
];

function App() {
  return (
    <main className="min-h-screen min-w-screen flex items-center justify-center bg-gray-100 overflow-hidden">
      <div className="w-full max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          Custom HLS Video Player
        </h1>

        <VideoPlayer
          src="https://vz-50e60d70-540.b-cdn.net/b87ac5f4-2cf0-42d1-acc8-32a89d3c71c7/playlist.m3u8"
          chapters={mockChapters}
          // title="Corporate Training Video"
        />
      </div>
    </main>
  );
}

export default App;
