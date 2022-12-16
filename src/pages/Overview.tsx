import { gsap } from "gsap";
import { Component, onMount } from "solid-js";

const Overview: Component = () => {
  onMount(() => {
    gsap.from(".slide-in", { opacity: 0, y: 20, duration: 1, stagger: 0.25 });
  });

  return (
    <div class="space-y-6">
      <div class="slide-in text-center text-8xl">ec-site</div>
      <div class="slide-in text-center">ショッピングをしましょう。</div>
    </div>
  );
};

export default Overview;
