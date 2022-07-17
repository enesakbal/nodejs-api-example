exports.randomkey = async () => {
    const generate_key = Math.floor(Math.random() * (999999 - 100000)) + 100000;
    return generate_key;
};