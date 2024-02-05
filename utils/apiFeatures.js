class APIFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        if (this.queryStr.keyword) {
            const keywordQuery = {
                nft_name: {
                    $regex: this.queryStr.keyword,
                    $options: "i"
                }
            };

            this.query = this.query.find(keywordQuery);
        }
        if (this.queryStr.collection_id) {
            this.query = this.query.find({
                collection_id: this.queryStr.collection_id
            });
        }

        return this;
    }
}

module.exports = APIFeatures;
