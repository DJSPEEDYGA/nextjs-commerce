/**
 * GOAT Connect — User Database (In-Memory for Demo)
 * Copyright © 2024 HARVEY L MILLER JR / JUAQUIN J MALPHURS / KEVIN W HALLINGQUEST
 *
 * In-memory user database for demo mode
 * Production: Replace with PostgreSQL + Redis + Elasticsearch
 */

class UserDatabase {
    constructor() {
        this.users = new Map();
        this.posts = new Map();
        this.likes = new Map();
        this.matches = new Map();

        // Seed demo users
        this._seedDemoUsers();
    }

    _seedDemoUsers() {
        const demoUsers = [
            { id: 'user-001', name: 'Aaliyah', email: 'aaliyah@demo.com', age: 26, location: 'Atlanta, GA', verified: true, bgChecked: true, bankVerified: true, trustScore: 97, icon: '💜', genres: ['R&B', 'Hip-Hop'], bio: 'Music lover, producer, entrepreneur.' },
            { id: 'user-002', name: 'Marcus',  email: 'marcus@demo.com',  age: 29, location: 'Miami, FL',   verified: true, bgChecked: true, bankVerified: true, trustScore: 95, icon: '🔥', genres: ['Hip-Hop', 'Trap'], bio: 'DJ, entrepreneur, fitness buff.' },
            { id: 'user-003', name: 'Zara',    email: 'zara@demo.com',    age: 24, location: 'Los Angeles, CA', verified: true, bgChecked: true, bankVerified: false, trustScore: 88, icon: '🌟', genres: ['Pop', 'R&B'], bio: 'Singer-songwriter, fashion designer.' },
            { id: 'user-004', name: 'Darius',  email: 'darius@demo.com',  age: 31, location: 'New York, NY', verified: true, bgChecked: true, bankVerified: true, trustScore: 99, icon: '💎', genres: ['Hip-Hop', 'Jazz'], bio: 'Music executive, sneakerhead.' },
            { id: 'user-005', name: 'Jasmine', email: 'jasmine@demo.com', age: 27, location: 'Houston, TX', verified: true, bgChecked: true, bankVerified: true, trustScore: 96, icon: '🦋', genres: ['Hip-Hop', 'R&B'], bio: 'Software engineer by day, poet by night.' },
        ];

        demoUsers.forEach(u => {
            this.users.set(u.id, { ...u, createdAt: new Date().toISOString(), token: 'demo-token-' + u.id });
        });

        // Seed demo posts
        const demoPosts = [
            { id: 'post-001', userId: 'user-001', content: '🎵 Studio session was FIRE tonight! New track dropping next week 🔥', likes: 284, comments: 42, timestamp: new Date(Date.now() - 3600000).toISOString(), musicTrackId: 'track-001', datingPosition: 'The Collaborator' },
            { id: 'post-002', userId: 'user-002', content: '🔑 Another one! Successfully launched the new mix. God is great. 🙏', likes: 512, comments: 89, timestamp: new Date(Date.now() - 7200000).toISOString(), datingPosition: 'The Feature' },
            { id: 'post-003', userId: 'user-005', content: '💻 Debugging code AND writing lyrics at the same time. Two-step workflow is undefeated 🦋', likes: 341, comments: 67, timestamp: new Date(Date.now() - 1800000).toISOString(), datingPosition: 'The Bridge' },
            { id: 'post-004', userId: 'user-004', content: '🎹 Jazz + Hip-Hop session tonight. The samples are talking to me different rn.', likes: 198, comments: 33, timestamp: new Date(Date.now() - 900000).toISOString(), datingPosition: 'The Producer' },
            { id: 'post-005', userId: 'user-003', content: '✈️ LA → NYC for a collab. Music has no geography 🌟', likes: 423, comments: 58, timestamp: new Date(Date.now() - 14400000).toISOString(), datingPosition: 'The Hook' },
        ];

        demoPosts.forEach(p => this.posts.set(p.id, p));
    }

    getUserCount() {
        return this.users.size;
    }

    async createUser(data) {
        const id = 'user-' + Date.now();
        const token = 'jwt-' + id + '-' + Math.random().toString(36).substr(2, 16);
        const user = {
            id, token,
            name: data.name,
            email: data.email,
            age: data.birthdate ? this._calcAge(data.birthdate) : null,
            gender: data.gender,
            location: data.location,
            verified: false,
            bgChecked: false,
            bankVerified: false,
            trustScore: 50,
            createdAt: new Date().toISOString()
        };
        this.users.set(id, user);
        return { id, token, success: true };
    }

    async authenticateUser(email, password) {
        const user = Array.from(this.users.values()).find(u => u.email === email);
        if (!user) return { success: false };
        return { success: true, userId: user.id, token: user.token, user: { id: user.id, name: user.name, email: user.email } };
    }

    async getUser(userId) {
        return this.users.get(userId) || null;
    }

    getDemoProfiles() {
        return Array.from(this.users.values()).map(u => ({
            id: u.id, name: u.name, age: u.age, location: u.location,
            verified: u.verified, bgChecked: u.bgChecked, bankVerified: u.bankVerified,
            trustScore: u.trustScore, icon: u.icon, bio: u.bio, genres: u.genres
        }));
    }

    async getSocialFeed(userId) {
        const posts = Array.from(this.posts.values())
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        return posts.map(p => {
            const author = this.users.get(p.userId);
            return {
                ...p,
                author: author ? { id: author.id, name: author.name, icon: author.icon, verified: author.verified, trustScore: author.trustScore } : null,
                liked: false
            };
        });
    }

    async createPost(data) {
        const { userId, content, mediaUrl, musicTrackId, datingPosition } = data;
        const id = 'post-' + Date.now();
        const post = { id, userId, content, mediaUrl, musicTrackId, datingPosition, likes: 0, comments: 0, timestamp: new Date().toISOString() };
        this.posts.set(id, post);
        return { success: true, postId: id, post };
    }

    async likePost(userId, postId) {
        const post = this.posts.get(postId);
        if (!post) return { success: false, error: 'Post not found' };
        post.likes++;
        return { success: true, likes: post.likes };
    }

    _calcAge(birthdate) {
        const today = new Date();
        const birth = new Date(birthdate);
        let age = today.getFullYear() - birth.getFullYear();
        if (today.getMonth() < birth.getMonth() || (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) age--;
        return age;
    }
}

module.exports = UserDatabase;