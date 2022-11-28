import { Route, Router, Routes } from "@solidjs/router";
import { Component } from "solid-js";

const Intro = () => {
	return (
		<>
			<div>このWebサイトは大学の課題として作られました。</div>
			<a href="/home" class="text-blue-600">続ける</a>
		</>
	);
};

const Home = () => {
	return (
		<div>Comming soon...</div>
	)
}

const App: Component = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={Intro} />
				<Route path="/home" element={Home} />
			</Routes>
		</Router>
	)
};

export default App;
