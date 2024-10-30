function typeEffect(element, text, speed = 100, callback) {
    let index = 0;
    
    // Supprimer tout curseur existant
    const existingCursor = element.querySelector('.cursor');
    if (existingCursor) {
        existingCursor.remove();
    }
    
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    cursor.textContent = '|';
    
    function type() {
        if (index < text.length) {
            element.insertBefore(document.createTextNode(text.charAt(index)), cursor);
            index++;
            setTimeout(type, speed);
        } else {
            cursor.className = 'cursor blink';
            if (callback) {
                console.log('Typing terminé');
                callback();
            }
        }
    }
    
    element.textContent = ''; // Clear the text first
    element.appendChild(cursor);
    type();
}

document.addEventListener('DOMContentLoaded', function() {
    // Effet de typing sur le h1 et gestion du paragraphe
    const h1Element = document.querySelector('.typing-effect');
    const pElement = document.querySelector('.hero-content p');
    
    if (h1Element && pElement) {
        pElement.style.opacity = '0'; // On s'assure que le paragraphe est invisible au début
        const text = h1Element.textContent;
        h1Element.textContent = ''; // On vide le h1 avant l'animation
        
        typeEffect(h1Element, text, 100, () => {
            console.log('Animation terminée, ajout de la classe visible');
            setTimeout(() => {
                pElement.removeAttribute('style'); // Supprime le style inline
                pElement.classList.add('visible');
            }, 200);
        });
    }

    const themeToggle = document.getElementById('theme-toggle');
    const burgerMenu = document.querySelector('.burger-menu');
    const navLinks = document.querySelector('.nav-links');

    // Gestion du menu burger
    burgerMenu.addEventListener('click', () => {
        burgerMenu.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Fermer le menu quand on clique sur un lien
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            burgerMenu.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // Vérifier la préférence enregistrée
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        themeToggle.checked = savedTheme === 'dark';
    }

    // Vérifier la préférence système
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    if (!savedTheme && prefersDark.matches) {
        document.documentElement.setAttribute('data-theme', 'dark');
        themeToggle.checked = true;
    }

    // Gérer le changement de thème
    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    });

    // Gestion des modales avec animation
    function openModal(modal) {
        modal.style.display = 'flex';
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.opacity = '1';
        }, 10);
    }

    function closeModal(modal) {
        modal.style.opacity = '0';
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300); // Correspond à la durée de la transition
    }

    // Modale CV
    const cvImage = document.getElementById('cvImage');
    const cvModal = document.getElementById('cvModal');
    const closeCvModal = cvModal.querySelector('.close-modal');

    cvImage.addEventListener('click', () => {
        openModal(cvModal);
        document.body.style.overflow = 'hidden';
    });

    closeCvModal.addEventListener('click', () => {
        closeModal(cvModal);
        document.body.style.overflow = '';
    });

    // Modale Discord
    const discordLink = document.getElementById('discord-link');
    const discordModal = document.getElementById('discordModal');
    const closeDiscordModal = discordModal.querySelector('.close-modal');

    discordLink.addEventListener('click', () => {
        openModal(discordModal);
        document.body.style.overflow = 'hidden';
    });

    closeDiscordModal.addEventListener('click', () => {
        closeModal(discordModal);
        document.body.style.overflow = '';
    });

    // Fermeture des modales en cliquant en dehors
    window.addEventListener('click', (e) => {
        if (e.target === cvModal) {
            closeModal(cvModal);
            document.body.style.overflow = '';
        }
        if (e.target === discordModal) {
            closeModal(discordModal);
            document.body.style.overflow = '';
        }
    });

    // Gestion de la modale Discord
    const copyButton = document.getElementById('copyDiscord');
    const discordId = document.getElementById('discordId');

    // Copier l'ID Discord
    copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(discordId.value).then(() => {
            copyButton.innerHTML = '<i class="fas fa-check"></i> Copié !';
            setTimeout(() => {
                copyButton.innerHTML = '<i class="far fa-copy"></i> Copier';
            }, 2000);
        });
    });

    // Gestion du formulaire de contact
    const form = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        // Récupération des éléments du formulaire
        const formData = new FormData(form);
        
        const templateParams = {
            from_name: formData.get('from_name'),
            user_email: formData.get('user_email'),
            message: formData.get('message')
        };

        // Debug - vérification des valeurs
        console.log('Données à envoyer:', templateParams);

        // Vérification que les champs ne sont pas vides
        if (!templateParams.from_name || !templateParams.user_email || !templateParams.message) {
            formMessage.textContent = "Veuillez remplir tous les champs";
            formMessage.className = "form-message error";
            return;
        }

        formMessage.textContent = "Envoi en cours...";
        formMessage.className = "form-message info";

        emailjs.send('service_yx095xh', 'template_7d98fvj', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                console.log('Données envoyées:', templateParams);
                formMessage.textContent = "Message envoyé avec succès !";
                formMessage.className = "form-message success";
                form.reset();
            })
            .catch(function(error) {
                console.error('FAILED...', error);
                formMessage.textContent = "Erreur lors de l'envoi : " + error.text;
                formMessage.className = "form-message error";
            });
    });

    // Animation des barres de compétences
    function animateProgressBars() {
        const progressBars = document.querySelectorAll('.progress');
        
        progressBars.forEach(progress => {
            const value = progress.getAttribute('data-value');
            const progressText = progress.querySelector('.progress-text');
            
            // Réinitialiser la largeur
            progress.style.width = '0%';
            if (progressText) progressText.textContent = '0%';
            
            // Animation
            setTimeout(() => {
                progress.style.width = value + '%';
                if (progressText) {
                    let currentValue = 0;
                    const interval = setInterval(() => {
                        if (currentValue >= parseInt(value)) {
                            clearInterval(interval);
                        } else {
                            currentValue++;
                            progressText.textContent = currentValue + '%';
                        }
                    }, 20);
                }
            }, 200);
        });
    }

    // Observer pour déclencher l'animation au scroll
    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateProgressBars();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(skillsSection);
    }
});
