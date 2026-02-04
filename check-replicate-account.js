require('dotenv').config({ path: '.env.local' })

async function checkReplicateAccount() {
    const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN

    if (!REPLICATE_API_TOKEN) {
        console.error('❌ REPLICATE_API_TOKEN not found in .env.local')
        process.exit(1)
    }

    console.log('🔑 Token found:', REPLICATE_API_TOKEN.substring(0, 10) + '...')
    
    try {
        // Check account details
        console.log('\n📊 Checking account details...')
        const accountResponse = await fetch('https://api.replicate.com/v1/account', {
            headers: {
                'Authorization': `Token ${REPLICATE_API_TOKEN}`,
            }
        })

        if (!accountResponse.ok) {
            const error = await accountResponse.text()
            console.error('❌ Account check failed:', accountResponse.status, error)
            process.exit(1)
        }

        const accountData = await accountResponse.json()
        console.log('✅ Account details:')
        console.log(JSON.stringify(accountData, null, 2))

        // Check if we can list models
        console.log('\n🎨 Testing model access...')
        const modelsResponse = await fetch('https://api.replicate.com/v1/models/black-forest-labs/flux-schnell', {
            headers: {
                'Authorization': `Token ${REPLICATE_API_TOKEN}`,
            }
        })

        if (!modelsResponse.ok) {
            const error = await modelsResponse.text()
            console.error('❌ Model access failed:', modelsResponse.status, error)
            process.exit(1)
        }

        const modelData = await modelsResponse.json()
        console.log('✅ Model accessible:', modelData.name)

        console.log('\n🎉 Everything looks good! You should be able to generate images.')
        
    } catch (error) {
        console.error('❌ Error:', error.message)
        process.exit(1)
    }
}

checkReplicateAccount()
