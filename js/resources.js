// resources.js - Dynamic resource management system

class ResourceManager {
    constructor() {
        this.resources = null;
        this.markdownRenderer = null;
    }

    // Load resources from JSON
    async loadResources() {
        try {
            const response = await fetch('/data/resources.json');
            this.resources = await response.json();
            return this.resources;
        } catch (error) {
            console.error('Error loading resources:', error);
            return null;
        }
    }

    // Filter courses by various criteria
    filterCourses(filters = {}) {
        if (!this.resources) return [];

        let courses = [...this.resources.courses];

        // Filter by testament
        if (filters.testament) {
            courses = courses.filter(c => c.testament === filters.testament);
        }

        // Filter by tag
        if (filters.tag) {
            courses = courses.filter(c => c.tags.includes(filters.tag));
        }

        // Filter by book
        if (filters.book) {
            courses = courses.filter(c => c.book === filters.book);
        }

        // Filter by type
        if (filters.type) {
            courses = courses.filter(c => c.type === filters.type);
        }

        // Filter by status
        if (filters.status) {
            courses = courses.filter(c => c.status === filters.status);
        }

        // Search by text
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            courses = courses.filter(c =>
                c.title.toLowerCase().includes(searchLower) ||
                c.description.toLowerCase().includes(searchLower) ||
                c.book.toLowerCase().includes(searchLower) ||
                c.tags.some(tag => tag.toLowerCase().includes(searchLower))
            );
        }

        return courses;
    }

    // Get all unique values for a tag category
    getTagValues(category) {
        if (!this.resources || !this.resources.tags[category]) return [];
        return this.resources.tags[category];
    }

    // Get course by ID
    getCourse(courseId) {
        if (!this.resources) return null;
        return this.resources.courses.find(c => c.id === courseId);
    }

    // Render a course card
    renderCourseCard(course) {
        const statusBadge = course.status === 'in-progress' 
            ? '<span class="status-badge in-progress">In Progress</span>'
            : course.status === 'planned'
            ? '<span class="status-badge planned">Coming Soon</span>'
            : '';

        const tagsHTML = course.tags.slice(0, 3).map(tag => 
            `<span class="tag">${tag}</span>`
        ).join('');

        return `
            <div class="study-card" data-course-id="${course.id}" style="cursor: pointer;" onclick="window.location.href='course.html?id=${course.id}'">
                <div class="study-image" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; min-height: 200px;">
                    ${statusBadge}
                </div>
                <div class="study-content">
                    <span class="study-badge">${course.testament}</span>
                    <h3>${course.title}</h3>
                    <p>${course.description}</p>
                    <div class="study-tags">
                        ${tagsHTML}
                    </div>
                    <div class="study-meta">
                        <span>📖 ${course.lessons} Lessons</span>
                        <span>⏱️ ${course.weeks} Weeks</span>
                    </div>
                    <a href="course.html?id=${course.id}" class="btn btn-secondary" onclick="event.stopPropagation();">
                        ${course.status === 'in-progress' ? 'Start Study' : 'Learn More'}
                    </a>
                </div>
            </div>
        `;
    }

    // Render all courses to a container
    renderCourses(containerId, filters = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const courses = this.filterCourses(filters);
        
        if (courses.length === 0) {
            container.innerHTML = '<p class="no-results">No courses found matching your criteria.</p>';
            return;
        }

        container.innerHTML = courses.map(course => this.renderCourseCard(course)).join('');
    }

    // Load course details with lessons
    async loadCourse(courseId) {
        try {
            const response = await fetch(`/studies/${courseId}/course.json`);
            return await response.json();
        } catch (error) {
            console.error('Error loading course:', error);
            return null;
        }
    }

    // Load a lesson markdown file
    async loadLesson(courseId, lessonFile) {
        try {
            const response = await fetch(`/studies/${courseId}/${lessonFile}`);
            return await response.text();
        } catch (error) {
            console.error('Error loading lesson:', error);
            return null;
        }
    }

    // Convert markdown to HTML (simple implementation)
    // For production, consider using a library like marked.js
    simpleMarkdownToHTML(markdown) {
        let html = markdown;

        // Headers
        html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
        html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
        html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

        // Bold
        html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');

        // Italic
        html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');

        // Links
        html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>');

        // Blockquotes
        html = html.replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>');

        // Lists
        html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
        html = html.replace(/^- (.*$)/gim, '<li>$1</li>');
        html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');

        // Paragraphs
        html = html.split('\n\n').map(para => {
            if (!para.match(/^<[h|l|b]/)) {
                return `<p>${para}</p>`;
            }
            return para;
        }).join('\n');

        // Horizontal rules
        html = html.replace(/^---$/gim, '<hr>');

        return html;
    }
}

// Initialize search and filter functionality
function initializeResourceFilters(resourceManager) {
    const categoryFilter = document.getElementById('category-filter');
    const searchInput = document.getElementById('search-studies');
    const studiesGrid = document.getElementById('studies-grid');

    if (!categoryFilter || !searchInput || !studiesGrid) return;

    function applyFilters() {
        const filters = {
            search: searchInput.value
        };

        const category = categoryFilter.value;
        if (category !== 'all') {
            // Map category values to filter properties
            if (category === 'old-testament' || category === 'new-testament') {
                filters.testament = category === 'old-testament' ? 'Old Testament' : 'New Testament';
            } else if (category === 'topical') {
                filters.type = 'topical-study';
            } else if (category === 'character') {
                filters.type = 'character-study';
            }
        }

        resourceManager.renderCourses('studies-grid', filters);
    }

    categoryFilter.addEventListener('change', applyFilters);
    searchInput.addEventListener('input', applyFilters);
}

// Export for use in other scripts
window.ResourceManager = ResourceManager;
window.initializeResourceFilters = initializeResourceFilters;
