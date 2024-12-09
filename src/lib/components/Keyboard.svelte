<script>
</script>

<div class="container">
	<div class="keyboard">
		<div class="row">
			<div class="key">Ё</div>
			<div class="key">1</div>
			<div class="key">2</div>
			<div class="key">3</div>
			<div class="key">4</div>
			<div class="key">5</div>
			<div class="key">6</div>
			<div class="key">7</div>
			<div class="key">8</div>
			<div class="key">9</div>
			<div class="key">0</div>
			<div class="key">-</div>
			<div class="key">=</div>
			<div class="key w-2 text-sm">Backspace</div>
		</div>
		<div class="row">
			<div class="key w-1_5 text-sm">Tab</div>
			<div class="key">Й</div>
			<div class="key">Ц</div>
			<div class="key">У</div>
			<div class="key">К</div>
			<div class="key">Е</div>
			<div class="key">Н</div>
			<div class="key">Г</div>
			<div class="key">Ш</div>
			<div class="key">Щ</div>
			<div class="key">З</div>
			<div class="key">Х</div>
			<div class="key">Ъ</div>
			<div class="key w-1_5">\</div>
		</div>
		<div class="row">
			<div class="key w-1_5 text-sm">Caps Lock</div>
			<div class="key">Ф</div>
			<div class="key">Ы</div>
			<div class="key">В</div>
			<div class="key">А</div>
			<div class="key">П</div>
			<div class="key">Р</div>
			<div class="key">О</div>
			<div class="key">Л</div>
			<div class="key">Д</div>
			<div class="key">Ж</div>
			<div class="key">Э</div>
			<div class="key w-2_5 text-sm">Enter</div>
		</div>
		<div class="row">
			<div class="key w-2 text-sm">Shift</div>
			<div class="key">Я</div>
			<div class="key">Ч</div>
			<div class="key">С</div>
			<div class="key">М</div>
			<div class="key">И</div>
			<div class="key">Т</div>
			<div class="key">Ь</div>
			<div class="key">Б</div>
			<div class="key">Ю</div>
			<div class="key">.</div>
			<div class="key w-3 text-sm">Shift</div>
		</div>
	</div>
</div>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.keyboard {
		display: flex;
		flex-direction: column;
		gap: 0.2rem;
	}
	.row {
		display: flex;
		gap: 0.2rem;
		justify-content: space-between;
	}
	.key {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 2rem;
		height: 2rem;
		border: 1px solid black;
		border-radius: 0.25rem;
		/* margin-right: 0.2rem; */
	}
	.w-1_5 {
		width: 3rem;
	}
	.w-2 {
		width: 4rem;
	}
	.w-2_5 {
		width: 5rem;
	}
	.w-3 {
		width: 6rem;
	}
	.text-sm {
		font-size: 0.75rem;
		text-align: center;
	}
	:global(.highlighted) {
		background-color: rgb(0, 68, 255);
		color: white;
	}
</style>
