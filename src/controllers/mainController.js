const fs = require('fs');
const path = require('path');

const productsFilePath = path.join(__dirname, '../data/productsDataBase.json');
const products = JSON.parse(fs.readFileSync(productsFilePath, 'utf-8'));

const toThousand = n => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

const controller = {
	index: (req, res) => {

		let data = {
			insale: [],
			visited: []
		}

		products.forEach(product => {
			if (product.category == "visited") {
				data.visited.push(product)
			} else {
				data.insale.push(product)
			}
		});

		res.render("index", {
			data
		})
	},


	search: (req, res) => {


		let productSearch = products.filter(function (product) {
			productMayuscula = product.name.toUpperCase()
			let loQueSeBusco = req.query.keywords.toUpperCase()
			return productMayuscula.includes(loQueSeBusco)
		})




		res.render("results", {
			productSearch
		});
	},
};

module.exports = controller;