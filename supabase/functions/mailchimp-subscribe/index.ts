import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { email } = await req.json()

    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    const API_KEY = Deno.env.get('MAILCHIMP_API_KEY')
    const AUDIENCE_ID = Deno.env.get('MAILCHIMP_AUDIENCE_ID')
    
    // The server prefix is the part of the API key after the hyphen (e.g., usX)
    const DATACENTER = API_KEY?.split('-')[1]

    if (!API_KEY || !AUDIENCE_ID) {
      console.error("Missing Mailchimp Configuration")
      return new Response(
        JSON.stringify({ error: 'Mailchimp configuration missing on server' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const data = {
      email_address: email,
      status: 'subscribed'
    }

    const response = await fetch(
      `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members/`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${btoa(`any:${API_KEY}`)}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    )

    const responseData = await response.json()

    if (!response.ok) {
      // Check if user is already subscribed
      if (responseData.title === 'Member Exists') {
        return new Response(
          JSON.stringify({ error: 'This email is already subscribed!' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
        )
      }
      
      console.error('Mailchimp API Error:', responseData)
      return new Response(
        JSON.stringify({ error: responseData.detail || 'Failed to subscribe' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Successfully subscribed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
