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

// Ajouter cette fonction pour créer les particules
function createParticles() {
    const particlesContainer = document.querySelector('.particles');
    const numberOfParticles = 50;

    for (let i = 0; i < numberOfParticles; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Position aléatoire
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Taille aléatoire
        const size = Math.random() * 3 + 1;
        
        particle.style.cssText = `
            left: ${posX}%;
            top: ${posY}%;
            width: ${size}px;
            height: ${size}px;
            animation: float ${Math.random() * 8 + 4}s ease-in-out infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        
        particlesContainer.appendChild(particle);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Ajouter ceci au début de votre event listener DOMContentLoaded
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Empêche le comportement par défaut du lien
            
            // Récupère l'ID de la section cible depuis le href
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                // Calcul de l'offset pour tenir compte de la barre de navigation fixe
                const navHeight = document.querySelector('.nav-container').offsetHeight;
                const targetPosition = targetSection.offsetTop - navHeight;
                
                // Défilement fluide
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
            
            // Ferme le menu burger si ouvert (code existant)
            burgerMenu.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

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

    // Fonction pour animer les barres de compétences
    function animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-bar');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const percentage = entry.target.getAttribute('data-percentage');
                    entry.target.style.setProperty('--width', percentage + '%');
                    entry.target.querySelector('.progress').style.width = percentage + '%';
                    observer.unobserve(entry.target); // Arrête d'observer une fois animé
                }
            });
        }, {
            threshold: 0.1 // Déclenche quand 10% de l'élément est visible
        });

        skillBars.forEach(bar => {
            observer.observe(bar);
        });
    }

    // Observer pour déclencher l'animation au scroll
    const skillsSection = document.querySelector('.skills');
    if (skillsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkillBars();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(skillsSection);
    }

    // Appeler la fonction createParticles
    createParticles();

    // Appeler la fonction d'animation des barres
    animateSkillBars();
});

//carousel

let currentSlide = 0;

function moveSlide(direction) {
    const slides = document.querySelectorAll('.carousel-item');
    const totalSlides = slides.length;

    // Masquer l'ancienne diapositive
    slides[currentSlide].classList.remove('active');
    document.querySelectorAll('.indicator')[currentSlide].classList.remove('active');

    // Calculer la nouvelle diapositive
    currentSlide = (currentSlide + direction + totalSlides) % totalSlides;

    // Afficher la nouvelle diapositive
    slides[currentSlide].classList.add('active');
    document.querySelectorAll('.indicator')[currentSlide].classList.add('active');

    // Déplacer le carrousel
    const carouselInner = document.querySelector('.carousel-inner');
    carouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function moveToSlide(index) {
    const slides = document.querySelectorAll('.carousel-item');
    const totalSlides = slides.length;

    // Masquer l'ancienne diapositive
    slides[currentSlide].classList.remove('active');
    document.querySelectorAll('.indicator')[currentSlide].classList.remove('active');

    // Afficher la nouvelle diapositive
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    document.querySelectorAll('.indicator')[currentSlide].classList.add('active');

    // Déplacer le carrousel
    const carouselInner = document.querySelector('.carousel-inner');
    carouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;
}