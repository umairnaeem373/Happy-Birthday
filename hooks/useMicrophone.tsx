import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { isMobile } from "react-device-detect";

// How often the raw microphone volume is committed to React state, in ms.
// Blow detection still runs on every animation frame; the reported volume is
// throttled because it changes every frame and re-rendering that often is
// wasteful for anything that just displays it.
const VOLUME_UPDATE_INTERVAL_MS = 100;

const useMicrophone = (microphoneDeniedMessage: string) => {
  const [microphoneVolume, setMicrophoneVolume] = useState<number>(0);
  const [averageVolume, setAverageVolume] = useState<number>(0);
  const [isBlowing, setIsBlowing] = useState<boolean>(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const volumeHistoryRef = useRef<number[]>([]);
  const lastVolumeUpdateRef = useRef(0);

  const stopMicrophone = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    setMicrophoneVolume(0);
    setAverageVolume(0);
    setIsBlowing(false);
    volumeHistoryRef.current = [];

    console.log("Microphone stopped");
  }, []);

  const setupMicrophone = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const audioContext = new AudioContext();
      const microphone = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      microphone.connect(analyser);

      audioContextRef.current = audioContext;

      const processMicrophoneData = () => {
        if (!streamRef.current || !streamRef.current.active) {
          return;
        }

        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyser.getByteFrequencyData(dataArray);

        const currentVolume = (dataArray.reduce((acc, val) => acc + val, 0) / bufferLength / 255) * 100;

        // Track volume history (keep last 30 readings)
        volumeHistoryRef.current.push(currentVolume);
        if (volumeHistoryRef.current.length > 30) {
          volumeHistoryRef.current.shift();
        }

        const runningAverage = volumeHistoryRef.current.length > 0
          ? volumeHistoryRef.current.reduce((a, b) => a + b, 0) / volumeHistoryRef.current.length
          : 0;

        // Detect blow: desktop 3x, mobile 4x
        const threshold = isMobile ? 4 : 3;
        const detected = runningAverage > 0 && currentVolume > runningAverage * threshold;

        // Blow detection runs every frame, but the reported volume is throttled
        // so the consumer is not re-rendered on every animation frame.
        const now = performance.now();
        if (now - lastVolumeUpdateRef.current >= VOLUME_UPDATE_INTERVAL_MS) {
          lastVolumeUpdateRef.current = now;
          setMicrophoneVolume(currentVolume);
          setAverageVolume(runningAverage);
        }
        setIsBlowing(detected);

        requestAnimationFrame(processMicrophoneData);
      };

      processMicrophoneData();
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error(microphoneDeniedMessage);
    }
  }, [microphoneDeniedMessage]);

  useEffect(() => {
    void setupMicrophone();

    return () => {
      stopMicrophone();
    };
  }, [setupMicrophone, stopMicrophone]);

  return {
    microphoneVolume,
    averageVolume,
    isBlowing,
    stopMicrophone,
  };
};

export default useMicrophone;