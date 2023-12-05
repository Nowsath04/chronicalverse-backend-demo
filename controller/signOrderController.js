const SignOrder = require("../models/SignorderSchema")
require('dotenv').config()

exports.SignOrderController = async (req, res, next) => {
    const { signature } = req.body;
    const { amount } = req.body;
    const { tokenId } = req.body;
    const { nftContract } = req.body;
    const { userAccount } = req.body;

    const signData = {
        signature: signature,
        amount: amount,
        tokenId: tokenId,
        nftContract: nftContract,
        userAccount: userAccount,
    }

    try {

        try {
            var data = await SignOrder.create(signData)
            res.json({
                data,
            })

        } catch (error) {
            console.log(error)

            res.json({
                message: "invalid ",
            })
        }


    } catch (error) {
    }


}
exports.removeSignOrder = async (req, res) => {
    let { token } = req.params
    let { nftContract } = req.params

    let data = await SignOrder.findOneAndDelete({ token: token, nftContract: nftContract });
    res.json(data)

}

exports.loadSignOrder = async (req, res) => {
    let { token } = req.params
    let { nftContract } = req.params

    let data = await SignOrder.findOne({ token: token, nftContract: nftContract });
    res.json(data)

}

