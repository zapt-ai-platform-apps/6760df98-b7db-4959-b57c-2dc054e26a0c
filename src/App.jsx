import { createSignal, createEffect, onMount, Show } from 'solid-js'
import { supabase, createEvent } from './supabaseClient'
import { Auth } from '@supabase/auth-ui-solid'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { SolidMarkdown } from "solid-markdown"
import { Document, Packer, Paragraph, TextRun } from 'docx'
import { saveAs } from 'file-saver'

function App() {
  const [user, setUser] = createSignal(null)
  const [currentPage, setCurrentPage] = createSignal('login')
  const [loading, setLoading] = createSignal(false)

  // Form fields
  const [dietaryPreference, setDietaryPreference] = createSignal('')
  const [cuisineTypes, setCuisineTypes] = createSignal([])
  const [includeIngredients, setIncludeIngredients] = createSignal('')
  const [excludeIngredients, setExcludeIngredients] = createSignal('')
  const [cookingTime, setCookingTime] = createSignal('')

  // Response
  const [supperIdeas, setSupperIdeas] = createSignal('')

  // Check if Web Share API is available
  const isShareSupported = navigator.share !== undefined

  const checkUserSignedIn = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setUser(user)
      setCurrentPage('homePage')
    }
  }

  onMount(checkUserSignedIn)

  createEffect(() => {
    const authListener = supabase.auth.onAuthStateChange((_, session) => {
      if (session?.user) {
        setUser(session.user)
        setCurrentPage('homePage')
      } else {
        setUser(null)
        setCurrentPage('login')
      }
    })

    return () => {
      authListener.data.unsubscribe()
    }
  })

  const handleGetSupperIdeas = async () => {
    setLoading(true)
    try {
      // Construct the prompt
      const prompt = `Please provide a few supper ideas based on the following preferences:
- Dietary preference: ${dietaryPreference() || 'No preference'}
- Preferred cuisines: ${cuisineTypes().length > 0 ? cuisineTypes().join(', ') : 'No preference'}
- Ingredients to include: ${includeIngredients() || 'None'}
- Ingredients to exclude: ${excludeIngredients() || 'None'}
- Cooking time available: ${cookingTime() || 'No preference'} minutes

Please format the response in markdown.`
      const result = await createEvent('chatgpt_request', {
        prompt: prompt,
        response_type: 'text'
      })
      setSupperIdeas(result)
    } catch (error) {
      console.error('Error getting supper ideas:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  const handleSaveAsWord = async () => {
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          new Paragraph({
            children: [new TextRun(supperIdeas().replace(/<\/?[^>]+(>|$)/g, ""))],
          }),
        ],
      }],
    })

    const blob = await Packer.toBlob(doc)
    saveAs(blob, "SupperIdeas.docx")
  }

  const handleShare = async () => {
    if (isShareSupported) {
      try {
        await navigator.share({
          title: 'My Supper Ideas',
          text: supperIdeas().replace(/<\/?[^>]+(>|$)/g, ""),
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      alert('Sharing is not supported on this device.')
    }
  }

  return (
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <Show
        when={currentPage() === 'homePage'}
        fallback={
          <div class="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-md">
            <h2 class="text-2xl font-bold mb-4 text-center text-purple-500">Sign in with ZAPT</h2>
            <a href="https://www.zapt.ai" target="_blank" rel="noopener noreferrer" class="text-purple-300 hover:underline mb-4 block text-center">
              Learn more about ZAPT
            </a>
            <Auth
              supabaseClient={supabase}
              appearance={{ theme: ThemeSupa }}
              providers={['google', 'facebook', 'apple']}
            />
          </div>
        }
      >
        <div class="w-full max-w-2xl p-6 bg-gray-800 rounded-lg shadow-md">
          <h1 class="text-2xl font-bold mb-6 text-center text-purple-500">Get Supper Ideas</h1>
          <div class="flex justify-end mb-6">
            <button
              class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </div>
          {/* Form */}
          <form class="space-y-4">
            {/* Dietary Preference */}
            <div>
              <label class="block mb-1 text-purple-300">Dietary Preference</label>
              <select
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded box-border"
                value={dietaryPreference()}
                onInput={(e) => setDietaryPreference(e.target.value)}
              >
                <option value="">No preference</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Vegan">Vegan</option>
                <option value="Gluten-free">Gluten-free</option>
              </select>
            </div>
            {/* Preferred Cuisines */}
            <div>
              <label class="block mb-1 text-purple-300">Preferred Cuisines</label>
              <input
                type="text"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded box-border"
                placeholder="e.g., Italian, Chinese, Mexican"
                value={cuisineTypes().join(', ')}
                onInput={(e) => setCuisineTypes(e.target.value.split(',').map(s => s.trim()))}
              />
            </div>
            {/* Include Ingredients */}
            <div>
              <label class="block mb-1 text-purple-300">Ingredients to Include</label>
              <input
                type="text"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded box-border"
                placeholder="e.g., chicken, broccoli"
                value={includeIngredients()}
                onInput={(e) => setIncludeIngredients(e.target.value)}
              />
            </div>
            {/* Exclude Ingredients */}
            <div>
              <label class="block mb-1 text-purple-300">Ingredients to Exclude</label>
              <input
                type="text"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded box-border"
                placeholder="e.g., nuts, dairy"
                value={excludeIngredients()}
                onInput={(e) => setExcludeIngredients(e.target.value)}
              />
            </div>
            {/* Cooking Time */}
            <div>
              <label class="block mb-1 text-purple-300">Cooking Time Available (minutes)</label>
              <input
                type="number"
                class="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded box-border"
                placeholder="e.g., 30"
                value={cookingTime()}
                onInput={(e) => setCookingTime(e.target.value)}
              />
            </div>
            {/* Submit Button */}
            <div>
              <button
                type="button"
                class="w-full px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 cursor-pointer"
                onClick={handleGetSupperIdeas}
                disabled={loading()}
              >
                <Show when={loading()} fallback="Get Supper Ideas">
                  Loading...
                </Show>
              </button>
            </div>
          </form>
          {/* Display Supper Ideas */}
          <Show when={supperIdeas()}>
            <div class="mt-6 p-4 bg-gray-700 rounded-lg border border-gray-600">
              <h3 class="text-xl font-semibold mb-2 text-purple-300">Your Supper Ideas:</h3>
              <div class="text-white prose">
                <SolidMarkdown children={supperIdeas()} />
              </div>
              <div class="flex space-x-4 mt-4">
                <button
                  class="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer"
                  onClick={handleSaveAsWord}
                >
                  Save as Word
                </button>
                <Show when={isShareSupported}>
                  <button
                    class="flex-1 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer"
                    onClick={handleShare}
                  >
                    Share
                  </button>
                </Show>
              </div>
            </div>
          </Show>
        </div>
      </Show>
    </div>
  )
}

export default App