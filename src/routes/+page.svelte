<script lang="ts">
	const letters = [
		'А', 'Б', 'В', 'Г', 'Д', 'Е', 'Ё', 'Ж', 'З', 'И', 'Й', 'К', 'Л', 'М', 'Н', 'О', 'П', 'Р', 'С', 'Т', 'У', 'Ф', 'Х', 'Ц', 'Ч', 'Ш', 'Щ', 'Ъ', 'Ы', 'Ь', 'Э', 'Ю', 'Я'];
	const sampleWords = ['привет', 'как', 'дела', 'программирование', 'сегодня', 'погода', 'хорошая', 'плохая', 'солнце', 'дождь', 'ветер', 'снег', 'зима', 'лето', 'осень', 'весна', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье', 'понедельник', 'вторник', 'среда']
	const translateQwertyToRussian = {
		'`': 'Ё', '1': '1', '2': '2', '3': '3', '4': '4', '5': '5', '6': '6', '7': '7', '8': '8', '9': '9', '0': '0', '-': '-', '=': '=',
		'q': 'Й', 'w': 'Ц', 'e': 'У', 'r': 'К', 't': 'Е', 'y': 'Н', 'u': 'Г', 'i': 'Ш', 'o': 'Щ', 'p': 'З', '[': 'Х', ']': 'Ъ', '\\': '\\',
		'a': 'Ф', 's': 'Ы', 'd': 'В', 'f': 'А', 'g': 'П', 'h': 'Р', 'j': 'О', 'k': 'Л', 'l': 'Д', ';': 'Ж', '\'': 'Э',
		'z': 'Я', 'x': 'Ч', 'c': 'С', 'v': 'М', 'b': 'И', 'n': 'Т', 'm': 'Ь', ',': 'Б', '.': 'Ю', '/': '.',
		' ': ' '
	}


	let charsToType = $state('')
	let currentCharIndex = $state(0)
	let errorMessages = $state()

	function highlightKeyOnKeyboard(key: string) {
		document.querySelector('.key')?.classList?.remove('highlighted')
		document.querySelector(`.key[text()="${key}"]`)?.classList?.add('highlighted')
	}

	function generateLesson() {
		for (let i = 0; i < 10; i++) {
			charsToType += sampleWords[Math.floor(Math.random() * sampleWords.length)] + ' '
		}
		currentCharIndex = 0
		errorMessages = ''
		highlightKeyOnKeyboard(charsToType[currentCharIndex])
	}

	function keyDownHandler(event: KeyboardEvent) {
		if (event.key === charsToType[currentCharIndex]) {
			currentCharIndex++
			highlightKeyOnKeyboard(charsToType[currentCharIndex])
		} else {
			errorMessages = `Incorrect key pressed (${event.key} instead of ${charsToType[currentCharIndex]})`
		}

	}
	
	import KeyboardLayout from '$lib/components/Keyboard.svelte'


</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<section>
	<h1>Kyle's Russian Typing Test</h1>

	<div id="typing-test-widget">
		<button onclick={generateLesson}>Generate Lesson</button>
		<p>
			{#each charsToType as ctt, index}
				<span class:typed={index < currentCharIndex}>{ctt}</span>
			{/each}
		<p>{errorMessages}</p>

		<input type="text" />
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

	h1 {
		width: 100%;
	}

	.typed {
		color: rgb(0, 68, 255);
	}


</style>
