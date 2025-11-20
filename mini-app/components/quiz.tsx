"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

type Animal = "cat" | "dog" | "fox" | "hamster" | "horse";

interface Question {
  text: string;
  options: { text: string; animal: Animal }[];
}

const questions: Question[] = [
  {
    text: "What’s your favorite way to spend a weekend?",
    options: [
      { text: "Curling up with a good book", animal: "cat" },
      { text: "Going for a long run", animal: "horse" },
      { text: "Exploring the woods", animal: "fox" },
      { text: "Playing with friends", animal: "dog" },
    ],
  },
  {
    text: "Which of these describes your personality best?",
    options: [
      { text: "Independent and curious", animal: "fox" },
      { text: "Loyal and friendly", animal: "dog" },
      { text: "Playful and energetic", animal: "hamster" },
      { text: "Calm and graceful", animal: "horse" },
    ],
  },
  {
    text: "What’s your ideal pet?",
    options: [
      { text: "A small, quiet companion", animal: "hamster" },
      { text: "A big, protective friend", animal: "dog" },
      { text: "A sleek, mysterious creature", animal: "fox" },
      { text: "A graceful, majestic animal", animal: "horse" },
    ],
  },
  {
    text: "How do you handle stress?",
    options: [
      { text: "I take a quiet moment to myself", animal: "cat" },
      { text: "I run or jump around", animal: "hamster" },
      { text: "I seek help from friends", animal: "dog" },
      { text: "I find a peaceful spot to reflect", animal: "horse" },
    ],
  },
  {
    text: "What’s your favorite snack?",
    options: [
      { text: "Fish", animal: "cat" },
      { text: "Bones", animal: "dog" },
      { text: "Seeds", animal: "hamster" },
      { text: "Grass", animal: "horse" },
    ],
  },
];

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [scores, setScores] = useState<Record<Animal, number>>({
    cat: 0,
    dog: 0,
    fox: 0,
    hamster: 0,
    horse: 0,
  });
  const [result, setResult] = useState<Animal | null>(null);

  const handleAnswer = (animal: Animal) => {
    setScores((prev) => ({ ...prev, [animal]: prev[animal] + 1 }));
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
    } else {
      const max = Math.max(...Object.values(scores));
      const winners = Object.entries(scores)
        .filter(([, v]) => v === max)
        .map(([k]) => k as Animal);
      setResult(winners[0]); // pick first in case of tie
    }
  };

  const retake = () => {
    setCurrent(0);
    setScores({ cat: 0, dog: 0, fox: 0, hamster: 0, horse: 0 });
    setResult(null);
  };

  if (result) {
    const imageSrc = `/${result}.png`;
    const animalNames: Record<Animal, string> = {
      cat: "Cat",
      dog: "Dog",
      fox: "Fox",
      hamster: "Hamster",
      horse: "Horse",
    };
    return (
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-2xl font-semibold">
          You are most like a {animalNames[result]}!
        </h2>
        <img
          src={imageSrc}
          alt={animalNames[result]}
          width={512}
          height={512}
          className="rounded-lg"
        />
        <Share text={`I am a ${animalNames[result]}! ${url}`} />
        <Button onClick={retake}>Retake Quiz</Button>
      </div>
    );
  }

  const shuffledOptions = shuffleArray(questions[current].options);

  return (
    <div className="flex flex-col items-center gap-4">
      <h2 className="text-xl font-medium">{questions[current].text}</h2>
      <div className="flex flex-col gap-2">
        {shuffledOptions.map((opt, idx) => (
          <Button key={idx} onClick={() => handleAnswer(opt.animal)}>
            {opt.text}
          </Button>
        ))}
      </div>
      <p className="text-muted-foreground">
        Question {current + 1} of {questions.length}
      </p>
    </div>
  );
}
