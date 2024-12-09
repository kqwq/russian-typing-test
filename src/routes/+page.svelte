<script lang="ts">
	import { onMount } from 'svelte';
	import KeyboardLayout from '$lib/components/Keyboard.svelte';

	const letters = [
		'А',
		'Б',
		'В',
		'Г',
		'Д',
		'Е',
		'Ё',
		'Ж',
		'З',
		'И',
		'Й',
		'К',
		'Л',
		'М',
		'Н',
		'О',
		'П',
		'Р',
		'С',
		'Т',
		'У',
		'Ф',
		'Х',
		'Ц',
		'Ч',
		'Ш',
		'Щ',
		'Ъ',
		'Ы',
		'Ь',
		'Э',
		'Ю',
		'Я'
	];
	const easyWords = [
		'мама',
		'папа',
		'дом',
		'кот',
		'собака',
		'мышь',
		'книга',
		'стол',
		'стул',
		'окно',
		'дверь',
	];
	const qwertyToRussianMap: { [key: string]: string } = {
		'`': 'Ё',
		'1': '1',
		'2': '2',
		'3': '3',
		'4': '4',
		'5': '5',
		'6': '6',
		'7': '7',
		'8': '8',
		'9': '9',
		'0': '0',
		'-': '-',
		'=': '=',
		q: 'Й',
		w: 'Ц',
		e: 'У',
		r: 'К',
		t: 'Е',
		y: 'Н',
		u: 'Г',
		i: 'Ш',
		o: 'Щ',
		p: 'З',
		'[': 'Х',
		']': 'Ъ',
		'\\': '\\',
		a: 'Ф',
		s: 'Ы',
		d: 'В',
		f: 'А',
		g: 'П',
		h: 'Р',
		j: 'О',
		k: 'Л',
		l: 'Д',
		';': 'Ж',
		"'": 'Э',
		z: 'Я',
		x: 'Ч',
		c: 'С',
		v: 'М',
		b: 'И',
		n: 'Т',
		m: 'Ь',
		',': 'Б',
		'.': 'Ю',
		'/': '.',
		' ': ' '
	};
	function translateQwertyToRussianKey(key: string): string {
		return qwertyToRussianMap[key] ?? key;
	}

	let charsToType = $state('');
	let currentCharIndex = $state(0);
	let typedChars = $state('');
	let isInputFocused = $state(false);

	function highlightKeyboardKeys(correctKey: string, wrongKey?: string) {
		const keys = document.querySelectorAll('.key') as NodeListOf<HTMLDivElement>;
		const correctKeyColor = '#98F5F9';
		const wrongKeyColor = '#EFC3CA';
		correctKey = correctKey.toUpperCase();
		wrongKey = wrongKey?.toUpperCase();
		keys.forEach((key) => {
			if (key.textContent === correctKey) {
				key.style.backgroundColor = correctKeyColor;
			} else if (key.textContent === wrongKey) {
				key.style.backgroundColor = wrongKeyColor;
			} else {
				key.style.backgroundColor = 'transparent';
			}
		});
	}

	function generateLesson() {
		for (let i = 0; i < 10; i++) {
			charsToType += easyWords[Math.floor(Math.random() * easyWords.length)] + ' ';
		}
		currentCharIndex = 0;
		highlightKeyboardKeys(charsToType[currentCharIndex]);
	}

	function keyDownHandler(event: KeyboardEvent) {
		if (isInputFocused) {
			event.preventDefault();
			const keyTyped = (translateQwertyToRussianKey(event.key) ?? event.key).toLowerCase();

			// If correct key, type it, move to next character, and highlight keyboard key
			if (keyTyped === charsToType[currentCharIndex]) {
				typedChars += charsToType[currentCharIndex];
				currentCharIndex++;
				highlightKeyboardKeys(charsToType[currentCharIndex]);
			} else {
				highlightKeyboardKeys(charsToType[currentCharIndex], keyTyped);
			}

			if (currentCharIndex === charsToType.length) {
				// generateLesson();
			}
		} else {

		}

	

	}	
	
	onMount(() => {
			generateLesson();
			console.log('mounted');
		});

</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>

	<div id="typing-test-widget">
		<!-- <button onclick={generateLesson}>Generate Lesson</button> -->
		<p id="type-this">
			{#each charsToType as ctt, index}
				<span class:typed={index < currentCharIndex} class:typing={index === currentCharIndex}>{ctt}</span>
			{/each}
		</p>
		<input type="text" value={typedChars} onfocus={() => isInputFocused = true} onblur={() => isInputFocused = false} />
		<KeyboardLayout />
	</div>
</section>

<svelte:window on:keydown={keyDownHandler} />

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
	#typing-test-widget {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}
	#type-this {
		font-size: 1.5rem;
		max-width: 600px;
		margin: 0;
	}
	#error-msg {
		color: red;
		margin: 0;
	}
	input {
		font-size: 1.5rem;
	}

	.typed {
		color: rgb(0, 68, 255);
	}
	.typing {
		text-decoration: underline;
	}
</style>
