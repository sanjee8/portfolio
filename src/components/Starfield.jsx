import { useEffect } from "react";
import * as THREE from "three";

export default function Starfield() {
    useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            2000
        );

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.domElement.style.position = "fixed";
        renderer.domElement.style.top = "0";
        renderer.domElement.style.left = "0";
        renderer.domElement.style.zIndex = "-1";

        document.body.insertBefore(renderer.domElement, document.body.firstChild);

        const starCount = 3500;
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        const color = new THREE.Color();

        for (let i = 0; i < starCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 3000;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 3000;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 3000;

            color.setHSL(0.6 + Math.random() * 0.15, 0.6, 0.7 + Math.random() * 0.3);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            sizes[i] = Math.random() * 1.8 + 0.4;
        }

        const starsGeometry = new THREE.BufferGeometry();
        starsGeometry.setAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3)
        );
        starsGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        starsGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

        const starsMaterial = new THREE.PointsMaterial({
            vertexColors: true,
            size: 1.8,
            transparent: true,
            opacity: 0.9,
            blending: THREE.AdditiveBlending,
        });

        const starField = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(starField);

        camera.position.z = 5;

        let animationId;
        function animate() {
            animationId = requestAnimationFrame(animate);

            starField.rotation.x += 0.0003;
            starField.rotation.y += 0.0005;
            starField.material.opacity =
                0.85 + Math.sin(Date.now() * 0.001) * 0.1;

            renderer.render(scene, camera);
        }

        animate();

        function handleResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        window.addEventListener("resize", handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", handleResize);
            renderer.dispose();
            renderer.domElement.remove();
        };
    }, []);

    return null;
}
