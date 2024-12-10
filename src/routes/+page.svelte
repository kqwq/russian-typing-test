<script lang="ts">
	import { onDestroy, onMount, tick } from 'svelte';
	import KeyboardLayout from '$lib/components/Keyboard.svelte';

	import { letters, easyWords, qwertyToRussianMap } from '$lib/data/rusLang';

	function translateQwertyToRussianKey(key: string): string {
		return qwertyToRussianMap[key] ?? key;
	}

	const maxMistakes = 3;

	type LessonListItem = {
		num: number;
		title: string;
		disabled?: boolean;
	};
	const lessonsList = [
		{ num: 1, title: 'Level 1: АО' },
		{ num: 2, title: 'Level 2: ВЛ' },
		{ num: 3, title: 'Level 3: ЫД' },
		{ num: 4, title: 'Level 4: ФЖ' },
		{ num: 5, title: 'Level 5: ПРЭ' },
		{ num: 6, title: 'Level 6: ФЫВАПРОЛДЖЭ' },
		{ num: 7, title: 'Level 7: КГ' },
		{ num: 8, title: 'Level 8: УШ' },
		{ num: 9, title: 'Level 9: ЦЩ' },
		{ num: 10, title: 'Level 10: ЙЗ' },
		{ num: 11, title: 'Level 11: ЁХЪ' },
		{ num: 12, title: 'Level 12: ЁЙЦУКЕНГШЩЗХЪ' }
	];
	let unlockedLessons = $state([1]);
	let displayLessonsList = $derived(lessonsList.map((l: LessonListItem) => ({ ...l, disabled: !unlockedLessons.includes(l.num) })));

	const KeyboardOption = {
		SHOW_WITH_HINTS: 'SHOW_WITH_HINTS',
		SHOW_WITHOUT_HINTS: 'SHOW_WITHOUT_HINTS',
		HIDE: 'HIDE'
	} as const;

	let charsToType = $state('');
	let currentCharIndex = $state(0);
	let typedChars = $state('');
	let isInputFocused = $state(true);
	let kbOption: keyof typeof KeyboardOption = $state(KeyboardOption.SHOW_WITH_HINTS);
	let curLessonNum = $state(1);
	let minutes = $state(0);
	let seconds = $state(0);
	let interval: NodeJS.Timeout;
	let timerStarted = $state(false);
	let completed = $state(false);
	let timestampStarted = $state(0);
	let timestampEnded = $state(0);
	let wpm = $state(0);
	let mistakes = $state(0);
	let failure = $state(false);

	type Lesson = {
		title: string;
		alphabet: string;
		words: [
			{
				word: string;
				def: string;
				ex: string;
				gt: string;
			}
		];
		typeLen?: number;
	};

	let curLesson = $state<Lesson>();

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

	function rChoice<T>(arr: T[]): T {
		return arr[Math.floor(arr.length * Math.random())];
	}

	function calculateWpm() {
		timestampEnded = Date.now();
		wpm = Math.round(currentCharIndex / 5 / ((timestampEnded - timestampStarted) / 1000 / 60));
	}

	function resetTimer() {
		minutes = 0;
		seconds = 0;
		completed = false;
		timerStarted = false;
		timestampStarted = 0;
		timestampEnded = 0;
	}

	async function generateLesson() {
		failure = false;
		mistakes = 0;
		resetTimer();
		curLesson = await fetch(`getLesson/${curLessonNum}`).then((res) => res.json());
		if (!curLesson) return;
		const cla = curLesson.alphabet.split('');
		const typeLen = curLesson.typeLen ?? 150;
		typedChars = '';
		charsToType = '';
		while (charsToType.length < 15) {
			charsToType += rChoice(cla) + ' ';
		}
		while (charsToType.length < 30) {
			charsToType += rChoice(cla) + rChoice(cla) + ' ';
		}
		while (charsToType.length < 40) {
			charsToType += rChoice(cla) + rChoice(cla) + rChoice(cla) + ' ';
		}
		while (charsToType.length < 50) {
			charsToType += rChoice(cla);
		}
		charsToType += ' ';
		while (charsToType.length < typeLen && curLesson.words.length > 0) {
			charsToType += rChoice(curLesson.words).word + ' ';
		}
		charsToType = charsToType.trim();
		currentCharIndex = 0;
		highlightKeyboardKeys(charsToType[currentCharIndex]);
		addTranslationToLesson();
	}

	async function addTranslationToLesson() {
		// await sleep(1000)
		await new Promise((resolve) => setTimeout(resolve, 200));
		const container = document.querySelector('#type-this-translation');
		if (container) container.innerHTML = '';

		if (curLesson?.words.length) {
			const words = charsToType.split(' ');
			let charPtr = 0;
			for (const word of words) {
				console.log(word);
				const wordObj = curLesson.words.find((w) => w.word === word);
				if (wordObj) {
					const charRuElement = document.querySelector(`#type-this span:nth-child(${charPtr + 1})`) as HTMLSpanElement;
					const charEnElement = document.createElement('span');
					if (container && charRuElement) {
						charEnElement.classList.add('translation');
						charEnElement.textContent = wordObj.gt.toLowerCase();
						charEnElement.title = wordObj.ex;
						charEnElement.style.top = `${charRuElement.offsetTop - 5}px`;
						charEnElement.style.left = `${charRuElement.offsetLeft}px`;
						container.appendChild(charEnElement);
					}
				}
				charPtr += word.length + 1;
			}
		}
	}

	function keyDownHandler(event: KeyboardEvent) {
		if (isInputFocused) {
			event.preventDefault();
			const keyTyped = (translateQwertyToRussianKey(event.key) ?? event.key).toLowerCase();

			// If correct key, type it, move to next character, and highlight keyboard key
			if (keyTyped === charsToType[currentCharIndex]) {
				if (!timerStarted) {
					timerStarted = true;
					timestampStarted = Date.now();
				}
				if (keyTyped === ' ') {
					typedChars = '';
				} else {
					typedChars += charsToType[currentCharIndex];
				}
				currentCharIndex++;
				highlightKeyboardKeys(charsToType[currentCharIndex]);
			} else if (keyTyped === 'backspace') {
				typedChars = typedChars.slice(0, -1);
				highlightKeyboardKeys(charsToType[currentCharIndex], keyTyped);
			} else {
				// Wrong key, increase mistakes
				highlightKeyboardKeys(charsToType[currentCharIndex], keyTyped);
				mistakes++;
				if (mistakes >= maxMistakes) {
					completed = true;
					failure = true;
					calculateWpm();
				}
			}

			if (currentCharIndex === charsToType.length) {
				typedChars = '';
				timerStarted = false;
				completed = true;
				timestampEnded = Date.now();
				calculateWpm();
				if (wpm >= 30) {
					if (!unlockedLessons.includes(curLessonNum + 1)) {
						unlockedLessons = [...unlockedLessons, curLessonNum + 1];
					}
				}
			}
		} else {
		}
	}

	onMount(() => {
		generateLesson();
		console.log('mounted');
		interval = setInterval(() => {
			if (timerStarted) {
				seconds++;
				if (seconds === 60) {
					minutes++;
					seconds = 0;
				}
			}
		}, 1000);
	});
	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<div id="typing-test-widget">
		<!-- <button onclick={generateLesson}>Generate Lesson</button> -->
		<p id="type-this" class:completed class:failure>
			{#each charsToType as ctt, index}
				<span class:typed={index < currentCharIndex} class:typing={index === currentCharIndex}>{ctt}</span>
			{/each}
		</p>
		<div id="type-this-translation"></div>
		<input
			type="text"
			value={typedChars}
			onfocus={() => (isInputFocused = true)}
			onblur={() => (isInputFocused = false)}
			autofocus
			bind:this={inputElement}
			disabled={completed}
		/>
		{#if kbOption !== KeyboardOption.HIDE}
			<KeyboardLayout />
		{/if}
		<div id="controls">
			<label for="lesson-option">Lesson:</label>
			<select id="lesson-option" bind:value={curLessonNum} onchange={generateLesson}>
				{#each displayLessonsList as { num, title, disabled }}
					<option value={num} disabled={!unlockedLessons.includes(num)}>{!unlockedLessons.includes(num) ? '🔒 ' : ''}{title}</option>
				{/each}
			</select>
			<label for="keyboard-option">Keyboard:</label>
			<select bind:value={kbOption} id="keyboard-option">
				<option value={KeyboardOption.SHOW_WITH_HINTS}>Show with hints</option>
				<option value={KeyboardOption.SHOW_WITHOUT_HINTS}>Show without hints</option>
				<option value={KeyboardOption.HIDE}>Hide</option>
			</select>
			<label for="timer">Timer:</label>
			<span id="timer">{minutes}:{seconds.toString().padStart(2, '0')}</span>
		</div>
		<div>
			{#if mistakes}
				<small style:color="red">Mistakes: {mistakes}</small>
			{/if}
		</div>
	</div>
</section>
{#if completed}
	<section id="section-completed" class:failure>
		{#if failure}
			<h2>Too many mistakes</h2>
		{:else if wpm < 30}
			<h2>Too slow</h2>
		{:else}
			<h2>Completed</h2>
		{/if}
		<h1>{wpm} WPM</h1>
		<p>Passing WPM: 30</p>
		<button onclick={generateLesson}>Try Again</button>
		<button>Next Lesson</button>
	</section>
{/if}

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
	#type-this.failure span {
		color: red;
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
	.completed span {
		color: rgb(0, 182, 76);
	}
	:global(.translation) {
		position: absolute;
		font-size: 0.75rem;
		color: gray;
		/* background-color: white; */
	}
	#section-completed {
		background-color: mediumslateblue;
		color: white;
		padding: 1rem;
		text-align: center;
		border-radius: 40px;
		margin-top: 2rem;
	}
	#section-completed.failure {
		background-color: rgb(182, 45, 45) !important;
	}
</style>
