'use client';

import { useEffect, useRef } from 'react';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

interface YouTubeEmbedProps {
  videoId: string;
  playlist?: string; // Added playlist parameter
  activePlayback?: boolean;
  playbackActive?: boolean;
  loop?: boolean;
  muted?: boolean;
  autoPlay?: boolean;
  className?: string;
  webp?: boolean;
}

export function extractYouTubeId(url: string): string {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[7].length === 11 ? match[7] : '';
}

export default function YouTubeEmbed({
  videoId,
  playlist = '',
  activePlayback = false,
  playbackActive = false,
  loop = false,
  muted = false,
  autoPlay = false,
  className = '',
  webp = true,
}: YouTubeEmbedProps) {
  // Extract video ID from URL if a full URL was provided
  const id = videoId.includes('youtube.com') || videoId.includes('youtu.be') ? extractYouTubeId(videoId) : videoId;
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // For workout mode: control video playback state
  useEffect(() => {
    if (!activePlayback || !iframeRef.current?.contentWindow) return;

    try {
      const command = playbackActive ? 'playVideo' : 'pauseVideo';
      iframeRef.current.contentWindow.postMessage(JSON.stringify({ event: 'command', func: command }), '*');
    } catch (e) {
      console.error('Error controlling YouTube player:', e);
    }
  }, [playbackActive, activePlayback]);

  // Build the playlist parameter
  const playlistParam = playlist ? `&playlist=${playlist}` : loop ? `&playlist=${id}` : '';

  // Workout mode: we need direct iframe control
  if (activePlayback) {
    return (
      <div className={`relative aspect-video w-full overflow-hidden rounded-lg ${className}`}>
        <iframe
          ref={iframeRef}
          src={`https://www.youtube-nocookie.com/embed/${id}?enablejsapi=1&loop=${loop ? 1 : 0}${playlistParam}&controls=0&mute=${muted ? 1 : 0}&autoplay=${autoPlay ? 1 : 0}&rel=0&modestbranding=1&showinfo=0`}
          title='Exercise demonstration'
          className='absolute top-0 left-0 h-full w-full border-0'
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
        />
      </div>
    );
  }

  // Homepage mode: simple click-to-play thumbnail
  return (
    <div className={className}>
      <LiteYouTubeEmbed
        id={id}
        title='YouTube video player'
        noCookie={true}
        params={playlistParam ? `loop=1${playlistParam.replace('&playlist=', '&playlist=')}` : ''}
        webp={webp}
      />
    </div>
  );
}
