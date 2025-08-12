

exports.getDate = () => {

    const date = new Date();

    const option = {
        weekday: "long",
        month: "long",
        day: "numeric"
    };

    return date.toLocaleDateString("en-NG", option);
}

exports.getDay = () => {

    const date = new Date();

    const option = {
        weekday: "long"
    };

    return date.toLocaleDateString("en-NG", option);
}
