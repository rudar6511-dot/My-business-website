import { createClient } from
"https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabase = createClient(
    "https://yefjfcrevavskvxzkkub.supabase.co",
 eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InllZmpmY3JldmF2c2t2eHpra3ViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODM3NzUxMjcsImV4cCI6MjA5OTM1MTEyN30.w7n3wBB4rEbq8Cg2RpOlg-bNnLjwrGIuWajAfhLhiUE
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
