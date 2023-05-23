const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findAll({ include: [{ model: Product }], });
    res.status(200).json(categoryData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  const category = await Category.findByPk(req.params.id, { include: [{ model: Product }] });
  try {
    if (!category) {
      res.status(404).json({ message: `Can't find that category!`});
      return;
    }
  
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const newCategory = await Category.create(req.body);
    res.status(200).json(newCategory);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value
  try {
    const editedCategory = await Category.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (editedCategory[0] === 0) {
      return res.status(404).json({ message: `Can't find that category!` });
    }

    res.status(200).json(editedCategory);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value
  try {
    const category = await Category.destroy({ where: { id: req.params.id } });

    if (!category) {
      res.status(404).json({ message: `Can't find that category!`});
      return;
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
