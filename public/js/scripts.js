
    document.addEventListener('DOMContentLoaded', () => {
        const navLinks = document.querySelectorAll('.nav-link');
        const contentDiv = document.getElementById('content');

        navLinks.forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                const linkName = link.getAttribute('data-link');
                try {
                    const response = await fetch(`/${linkName}`);
                    if (!response.ok) {
                        throw new Error(`Error fetching ${linkName}: ${response.statusText}`);
                    }
                    const html = await response.text();
                    contentDiv.innerHTML = html;
                } catch (err) {
                    console.error('Error fetching page:', err);
                    contentDiv.innerHTML = `<p style="color: red;">Error loading content. Please try again later.</p>`;
                }
            });
        });
    });

