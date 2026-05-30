function toCapitalize(str: string = ""): string {
	if (typeof str === "string") {
		const words = str.split(" ");
		const result: string[] = [];

		for (let i = 0; i < words.length; i++) {
			const _s = (words[i][0]?.toUpperCase() ?? "") + words[i].slice(1);
			result.push(_s);
		}
		return result.join(" ");
	}
	return "";
}

export { toCapitalize };
