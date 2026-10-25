"use client";

import React from "react";
import "../../app/birthday-cake.scss"
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import useMicrophone from "@/hooks/useMicrophone";
import { isMobile } from "react-device-detect";
import { randomNumberInRange } from "@/utils/utilFunctions";
import { CakeColors } from "@/utils/cakePalette";
import { age } from "@/lib/config";
import { Button } from "../ui/button";
import { Mic2 } from "lucide-react";

const DEBUG = false;

interface CandlePosition {
    x: number;
    y: number;
    isLit: boolean;
}

// palette data in components/cakePalettes.ts
function hexToRgb(hex: string) {
    const normalizedHex = hex.replace("#", "");
    const value = normalizedHex.length === 3
        ? normalizedHex.split("").map((character) => character + character).join("")
        : normalizedHex;

    const numericValue = Number.parseInt(value, 16);

    return {
        red: (numericValue >> 16) & 255,
        green: (numericValue >> 8) & 255,
        blue: numericValue & 255,
    };
}

function mixColor(hex: string, mixWith: string, amount: number) {
    const base = hexToRgb(hex);
    const mix = hexToRgb(mixWith);

    const red = Math.round(base.red + (mix.red - base.red) * amount);
    const green = Math.round(base.green + (mix.green - base.green) * amount);
    const blue = Math.round(base.blue + (mix.blue - base.blue) * amount);

    return `rgb(${red}, ${green}, ${blue})`;
}

function buildLayerStyle(color: string) {
    return {
        backgroundColor: color,
        boxShadow: [
            `0 2px 0px ${mixColor(color, "#ffffff", 0.18)}`,
            `0 4px 0px ${mixColor(color, "#000000", 0.08)}`,
            `0 6px 0px ${mixColor(color, "#000000", 0.09)}`,
            `0 8px 0px ${mixColor(color, "#000000", 0.1)}`,
            `0 10px 0px ${mixColor(color, "#000000", 0.11)}`,
            `0 12px 0px ${mixColor(color, "#000000", 0.12)}`,
            `0 14px 0px ${mixColor(color, "#000000", 0.13)}`,
            `0 16px 0px ${mixColor(color, "#000000", 0.14)}`,
            `0 18px 0px ${mixColor(color, "#000000", 0.15)}`,
            `0 20px 0px ${mixColor(color, "#000000", 0.16)}`,
            `0 22px 0px ${mixColor(color, "#000000", 0.17)}`,
            `0 24px 0px ${mixColor(color, "#000000", 0.18)}`,
            `0 26px 0px ${mixColor(color, "#000000", 0.19)}`,
            `0 28px 0px ${mixColor(color, "#000000", 0.2)}`,
            `0 30px 0px ${mixColor(color, "#000000", 0.21)}`,
        ].join(", "),
    };
}

const wait = (milliseconds: number) =>
    new Promise<void>((resolve) => {
        setTimeout(resolve, milliseconds);
    });

interface CandleProps {
    position: CandlePosition;
    index: number;
    candleColor: string;
    flameColor: string;
    onRendered: () => void;
}

// Each candle owns its GSAP timelines so the drop-in and flame
// animations can be set up and cleaned up independently
const Candle = ({ position, index, candleColor, flameColor, onRendered }: CandleProps) => {
    const candleRef = useRef<HTMLDivElement>(null);
    const flameRef = useRef<HTMLDivElement>(null);
    const [flameVisible, setFlameVisible] = useState(true);

    // Animate the candle dropping from the top
    useEffect(() => {
        if (!candleRef.current) {
            return;
        }

        // Due to the limited hardware of smartphones, we use a longer
        // delay/stagger to reduce the performance impact of the animation
        const delay = isMobile ? (0.6 + index * 0.1) : (index * 0.03);

        const tween = gsap.fromTo(
            candleRef.current,
            { y: -100, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                delay,
                duration: 0.4,
                ease: "power2.out",
                // Keep track of rendered candles to prevent blowing candles during rendering
                onComplete: onRendered,
            }
        );

        return () => {
            tween.kill();
        };
    }, [index, onRendered]);

    // Fade the flame out once the candle is blown out
    useEffect(() => {
        if (position.isLit) {
            return;
        }

        const flame = flameRef.current;
        if (!flame) {
            return;
        }

        // Flame fade duration scales with age: younger = faster, older = slower
        const tween = gsap.to(flame, {
            opacity: 0,
            duration: Math.max(0.15, Math.min(0.8, 0.15 + age * 0.01)),
            onComplete: () => setFlameVisible(false),
        });

        return () => {
            tween.kill();
        };
    }, [position.isLit]);

    return (
        <div
            ref={candleRef}
            className="candle"
            style={{
                left: `${position.x}px`,
                top: `${position.y}px`,
                backgroundColor: candleColor,
                // Start hidden until the GSAP drop-in tween runs
                opacity: 0,
                transform: "translateY(-100px)",
            }}
        >
            {flameVisible && (
                <div
                    ref={flameRef}
                    className="flame"
                    style={{
                        backgroundColor: flameColor,
                    }}
                />
            )}

            <div className="candle-wick"></div>
        </div>
    );
};

interface BirthdayCakeProps {
    cakeColors: CakeColors;
}

const BirthdayCake = ({ cakeColors }: BirthdayCakeProps) => {
    const [candlePositions, setCandlePositions] = useState<CandlePosition[]>([]);
    const { microphoneVolume, averageVolume, isBlowing, stopMicrophone } = useMicrophone("Please allow microphone access for the full experience!");

    // The blow-out loop runs asynchronously, so it reads the candle state from
    // refs (always current) instead of a render closure (which would be stale
    // and would never see a candle change to "blown out").
    const candlePositionsRef = useRef<CandlePosition[]>([]);
    const renderedCandlesRef = useRef<number>(0);

    // Stable callback so each Candle's drop-in timeline only runs once on mount
    const handleCandleRendered = useCallback(() => {
        renderedCandlesRef.current += 1;
    }, []);

    // Keep the ref and the state in lockstep so async work always sees the
    // latest positions while rendering still reacts to the state
    const applyCandlePositions = useCallback((positions: CandlePosition[]) => {
        candlePositionsRef.current = positions;
        setCandlePositions(positions);
    }, []);

    // Memoize the layer styles to ensure consistency between server and client renders
    const bottomLayerStyle = useMemo(() => buildLayerStyle(cakeColors.bottom), [cakeColors.bottom]);
    const middleLayerStyle = useMemo(() => buildLayerStyle(cakeColors.middle), [cakeColors.middle]);
    const topLayerStyle = useMemo(() => buildLayerStyle(cakeColors.top), [cakeColors.top]);

    if (DEBUG) {
        console.log("Volume:", microphoneVolume.toFixed(2), "Average:", averageVolume.toFixed(2), "Blowing:", isBlowing);
    }

    // Function to blow out a single candle
    const blowOutCandle = useCallback((candle: { x: number; y: number; isLit: boolean }) => {
        // Set the isLit property of the candle in the candlePositions useState to false
        applyCandlePositions(
            candlePositionsRef.current.map((position) =>
                position.x === candle.x && position.y === candle.y
                    ? { ...position, isLit: false }
                    : position
            )
        );
    }, [applyCandlePositions]);

    // Function to blow out many candles at once (use for microphone input)
    const blowOutCandles = useCallback(async () => {
        if (renderedCandlesRef.current != candlePositionsRef.current.length) {
            return;
        }

        // Filter the candles that are currently lit
        const litCandles = candlePositionsRef.current.filter((candle) => candle.isLit);

        // Iterate through each lit candle and blow it out
        for (const candle of litCandles) {
            // 98% success rate when blowing
            if (Math.random() > 0.02) {
                blowOutCandle(candle);
            }

            await wait(30);
        }

        // If there is no more candles to blow out, stop the microphone
        if (!candlePositionsRef.current.some((candle) => candle.isLit)) {
            stopMicrophone();
        }
    }, [blowOutCandle, stopMicrophone]);

    // Function to blow out all candles immediately (use for button click)
    const blowOutAllCandles = useCallback(async () => {
        // Repeatedly call blowOutCandles until all are blown, retrying the rare
        // 2% misses. Reading the lit candles from the ref means the loop
        // actually sees the candles it has blown out and terminates, while the
        // small delay avoids a tight loop while the candles are still dropping
        // in (blowOutCandles bails out until they are all rendered).
        while (candlePositionsRef.current.some((candle) => candle.isLit)) {
            await blowOutCandles();
            await wait(30);
        }
    }, [blowOutCandles]);

    // TODO: * Use vibration to also blow out candles or add animation where candle light flickers when moving the phone

    // Measure the cake as soon as it is mounted and derive the candle positions.
    // A callback ref runs during the commit phase (not during render), so the
    // element's layout is already available for measuring.
    const setupCandles = useCallback((cakeElement: HTMLDivElement | null) => {
        if (!cakeElement) {
            return;
        }

        const cakeWidth = cakeElement.offsetWidth;
        const icing = cakeElement.querySelector<HTMLElement>(".icing");
        const icingHeight = icing?.offsetHeight ?? 0;
        const numberOfCandles = age; // Number of candles you want to place on the cake

        // Generate random x and y coordinates for each candle
        const positions = Array.from({ length: numberOfCandles }, () => {
            // Random x coordinate between 12% and 88% of the cake width
            const randomX = Math.floor(Math.random() * (cakeWidth * 0.76) + cakeWidth * 0.12);
            // Random y coordinate between the icing height - 115 and icing height - 75
            const randomY = Math.floor(randomNumberInRange(icingHeight - 115, icingHeight - 75));

            return { x: randomX, y: randomY, isLit: true };
        });

        // Sort the positions based on y-coordinate in descending order
        positions.sort((a, b) => b.y - a.y);

        renderedCandlesRef.current = 0;
        applyCandlePositions(positions);
    }, [applyCandlePositions]); // Candles only need to be laid out once, when the cake mounts

    useEffect(() => {
        if (!isBlowing) {
            return;
        }

        // Defer the blow-out to the next frame so the cascade of candle state
        // updates does not happen synchronously inside this effect
        const frame = requestAnimationFrame(() => {
            void blowOutCandles();
        });

        return () => cancelAnimationFrame(frame);
    }, [isBlowing, blowOutCandles]); // Trigger the effect when isBlowing or blowOutCandles changes

    return (
        // Display the cake and candles on the screen using CSS classes
        <>
            <div className="flex justify-center">
                <div className="cake" ref={setupCandles}>
                    <div className="plate"></div>
                    <div className="layer layer-bottom" style={bottomLayerStyle}></div>
                    <div className="layer layer-middle" style={middleLayerStyle}></div>
                    <div className="layer layer-top" style={topLayerStyle}></div>
                    <div
                        className="icing"
                        style={{
                            backgroundColor: cakeColors.icing,
                        }}
                    ></div>
                    <div className="drip drip1" style={{ backgroundColor: cakeColors.drip1 }}></div>
                    <div className="drip drip2" style={{ backgroundColor: cakeColors.drip2 }}></div>
                    <div className="drip drip3" style={{ backgroundColor: cakeColors.drip3 }}></div>

                    {/* Add candles to the cake
              Note: we want to use slice() to create a temporary copy and reverse its order
              This way, the candles are rendered from the top to bottom
              Making the bottom candles cover the top ones, avoiding overlapping*/}
                    {candlePositions
                        .slice()
                        .reverse()
                        .map((candlePosition, index) => (
                            <Candle
                                key={index}
                                index={index}
                                position={candlePosition}
                                candleColor={cakeColors.candle}
                                flameColor={cakeColors.flame}
                                onRendered={handleCandleRendered}
                            />
                        ))}
                </div>
            </div>

            <div className="flex flex-col items-center gap-2 mt-6 px-4">
                <Button
                    type="button"
                    onClick={() => blowOutAllCandles()}
                    className="bg-neutral-400 hover:bg-neutral-200 text-black font-bold py-2 px-6 rounded-full"
                >
                    Blow Out All Candles
                </Button>
                <p className="flex items-center gap-1.5 text-sm text-neutral-400">
                    <Mic2 fill="primary" className="w-4 h-4 text-primary animate-pulse" />
                    or blow into your microphone
                </p>
            </div>
        </>
    );
}

export default BirthdayCake;