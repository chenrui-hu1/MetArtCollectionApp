const addCondition = (query, condition, whereFlag) => {
    if (whereFlag) {
        return query + `WHERE ${condition} `;
    } else {
        return query + `AND ${condition} `;
    }
}

module.exports = {
    addCondition
}
