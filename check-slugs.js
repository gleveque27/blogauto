const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase env variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSlugs() {
    const { data, error } = await supabase
        .from('posts')
        .select('id, title, slug')
        .limit(10);

    if (error) {
        console.error('Error fetching posts:', error);
        return;
    }

    console.log('--- Post Slugs Check ---');
    data.forEach(post => {
        console.log(`ID: ${post.id}`);
        console.log(`Title: ${post.title}`);
        console.log(`Slug: ${post.slug}`);
        console.log('------------------------');
    });
}

checkSlugs();
