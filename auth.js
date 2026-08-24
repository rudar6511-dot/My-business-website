import { createClient } from
"https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
    "https://yefjfcrevavskvxzkkub.supabase.co",
    "YOUR_NEW_ANON_KEY"
);

// Google Login
window.googleLogin = async function () {

    const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",

        options: {
            redirectTo:
            "https://rudar6511-dot.github.io/My-business-websiteinka/"
        }
    });

    if (error) {
        alert(error.message);
    }
};
