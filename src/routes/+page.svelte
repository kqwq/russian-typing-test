<script lang="ts">
	import { onMount } from 'svelte';
	import KeyboardLayout from '$lib/components/Keyboard.svelte';

	import { letters, easyWords, qwertyToRussianMap } from '$lib/data/rusLang';
	import { lessons } from '$lib/data/rusLessons';
	function translateQwertyToRussianKey(key: string): string {
		return qwertyToRussianMap[key] ?? key;
	}

	const KeyboardOption = {
		SHOW_WITH_HINTS: 'SHOW_WITH_HINTS',
		SHOW_WITHOUT_HINTS: 'SHOW_WITHOUT_HINTS',
		HIDE: 'HIDE',
	} as const;

	let charsToType = $state('');
	let currentCharIndex = $state(0);
	let typedChars = $state('');
	let isInputFocused = $state(true);
	let kbOption: keyof typeof KeyboardOption = $state(KeyboardOption.SHOW_WITH_HINTS);
	let curLesson = $state(lessons[0]);
	let inputElement: HTMLInputElement;

	function highlightKeyboardKeys(correctKey?: string, wrongKey?: string) {
		if (kbOption !== KeyboardOption.SHOW_WITH_HINTS) return;
		const keys = document.querySelectorAll('.key') as NodeListOf<HTMLDivElement>;
		const correctKeyColor = '#98F5F9';
		const wrongKeyColor = '#EFC3CA';
		correctKey = correctKey?.toUpperCase();
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
		console.log(curLesson)
		typedChars = '';
		charsToType = '';
		while (charsToType.length < 100) {
			if (curLesson.noSpaces !== true) {
				charsToType += ' ';
			}
			const randomIndex = Math.floor(Math.random() * curLesson.pool.length);
			const randomWord = curLesson.pool[randomIndex];
			if (randomWord == ' ' && charsToType.endsWith(' ')) continue;
			charsToType += randomWord;
		}
		charsToType = charsToType.trim();
		currentCharIndex = 0;
		highlightKeyboardKeys(charsToType[currentCharIndex]);
	}

	function keyDownHandler(event: KeyboardEvent) {
		if (isInputFocused) {
			event.preventDefault();
			const keyTyped = (translateQwertyToRussianKey(event.key) ?? event.key).toLowerCase();

			// If correct key, type it, move to next character, and highlight keyboard key
			if (keyTyped === charsToType[currentCharIndex]) {
				if (keyTyped === ' ') {
					typedChars = '';
				} else {
					typedChars += charsToType[currentCharIndex];
				}
				currentCharIndex++;
				highlightKeyboardKeys(charsToType[currentCharIndex]);
				inputElement.setSelectionRange(currentCharIndex, currentCharIndex); // Scroll input to current character
			} else {
				highlightKeyboardKeys(charsToType[currentCharIndex], keyTyped);
			}

			if (currentCharIndex === charsToType.length) {
				generateLesson();
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
		<input type="text"
		 value={typedChars} 
		 onfocus={() => (isInputFocused = true)} 
		 onblur={() => (isInputFocused = false)} autofocus
		 bind:this={inputElement}
		 />
		{#if kbOption !== KeyboardOption.HIDE}
			<KeyboardLayout />
		{/if}
		<div id="controls">
			<label for="lesson-option">Lesson:</label>
			<select id="lesson-option" bind:value={curLesson} onchange={generateLesson}>
				{#each lessons as lesson}
					<option value={lesson}>{lesson.title}</option>
				{/each}
			</select>
			<label for="keyboard-option">Keyboard:</label>
			<select bind:value={kbOption} id="keyboard-option">
				<option value={KeyboardOption.SHOW_WITH_HINTS}>Show with hints</option>
				<option value={KeyboardOption.SHOW_WITHOUT_HINTS}>Show without hints</option>
				<option value={KeyboardOption.HIDE}>Hide</option>
			</select>
		</div>
	</div>
</section>

<svelte:window on:keydown={keyDownHandler} />

<style>
	#typing-test-widget {
		margin-top: 2rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}
	#type-this {
		font-size: 1.5rem;
		max-width: 600px;
		margin: 0;
		word-break: break-word;
	}
	input {
		font-size: 1.5rem;
		/* direction: rtl;
		overflow: hidden; */
	}

	.typed {
		color: rgb(0, 68, 255);
	}
	.typing {
		text-decoration: underline;
	}
</style>
