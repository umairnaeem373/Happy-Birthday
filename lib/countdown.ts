"use client";

import { useState, useEffect } from "react";
import { siteConfig } from "./config";

export interface CountdownData {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isBirthdayToday: boolean;
  hasPassed: boolean;
}

function calculateCountdown(): CountdownData {
  const now = new Date();
  const currentYear = now.getFullYear();
  const { month, day } = siteConfig.birthday;

  // Month is 0-indexed in JS Date
  const birthdayThisYear = new Date(currentYear, month - 1, day, 0, 0, 0);
  const birthdayNextYear = new Date(currentYear + 1, month - 1, day, 0, 0, 0);

  const isBirthdayToday =
    now.getMonth() === month - 1 && now.getDate() === day;
  const hasPassed = now > birthdayThisYear && !isBirthdayToday;

  const targetDate = hasPassed ? birthdayNextYear : birthdayThisYear;
  const diffMs = targetDate.getTime() - now.getTime();

  if (diffMs <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isBirthdayToday: true,
      hasPassed: false,
    };
  }

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  return {
    days,
    hours,
    minutes,
    seconds,
    isBirthdayToday,
    hasPassed,
  };
}

export function useCountdown(): CountdownData {
  const [countdown, setCountdown] = useState<CountdownData>(calculateCountdown);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return countdown;
}

export function formatCountdownLabel(value: number, singular: string, plural: string): string {
  return `${value} ${value === 1 ? singular : plural}`;
}