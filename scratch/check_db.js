const mongoose = require('mongoose');
const Category = require('./backend/models/Category');
const Subcategory = require('./backend/models/Subcategory');

async function checkCategories() {
    try {
        await mongoose.connect('mongodb://localhost:27017/education_system');
        const categories = await Category.find();
        const subcategories = await Subcategory.find().populate('categoryId');
        
        console.log('Categories:');
        categories.forEach(c => console.log(`- ${c.name} (${c._id})`));
        
        console.log('\nSubcategories:');
        subcategories.forEach(s => console.log(`- ${s.name} (ID: ${s._id}, Category: ${s.categoryId?.name})`));
        
        await mongoose.disconnect();
    } catch (error) {
        console.error(error);
    }
}

checkCategories();
