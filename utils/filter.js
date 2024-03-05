export const checkNull = (value) => {
    if (value == null || value == undefined) {
        return '';
    }
    return value;
}

export const checkNameNull = (value) => {
    if (value == null || value == undefined) {
        return '';
    }
    let name = value.name;
    if (name == null || name == undefined) {
        return '';
    }
    return name;
}

export const checkNum = (value) => {
    if (value == null || value == undefined || value == 0) {
        return 0;
    } else if (value < 100) {
		return value;
	} else {
		return 99 + '+';
	}
}