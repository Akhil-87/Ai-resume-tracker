import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";

export default function Landing() {
  const canvasRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      42,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));
    const key = new THREE.DirectionalLight(0xffffff, 1.2);
    key.position.set(4, 5, 6);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xa9832e, 0.6);
    rim.position.set(-5, -2, 3);
    scene.add(rim);

    const medallion = new THREE.Group();

    // Base disc (ink-colored coin body)
    const discGeo = new THREE.CylinderGeometry(2.6, 2.6, 0.18, 64);
    const discMat = new THREE.MeshStandardMaterial({
      color: 0x1f2a24,
      roughness: 0.5,
      metalness: 0.25
    });
    const disc = new THREE.Mesh(discGeo, discMat);
    disc.rotation.x = Math.PI / 2;
    medallion.add(disc);

    // Brass rim ring
    const rimGeo = new THREE.TorusGeometry(2.6, 0.14, 24, 96);
    const rimMat = new THREE.MeshStandardMaterial({
      color: 0xa9832e,
      roughness: 0.35,
      metalness: 0.6
    });
    const rimMesh = new THREE.Mesh(rimGeo, rimMat);
    medallion.add(rimMesh);

    // Inner engraved rings (concentric, thinner, slightly recessed)
    [1.9, 1.4].forEach((radius) => {
      const ringGeo = new THREE.TorusGeometry(radius, 0.035, 16, 96);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xa9832e,
        roughness: 0.4,
        metalness: 0.5
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      medallion.add(ring);
    });

    // Center boss (small raised disc in the middle, like a seal's core)
    const bossGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.3, 32);
    const bossMat = new THREE.MeshStandardMaterial({
      color: 0x8b3a3a,
      roughness: 0.45,
      metalness: 0.2
    });
    const boss = new THREE.Mesh(bossGeo, bossMat);
    boss.rotation.x = Math.PI / 2;
    boss.position.z = 0.1;
    medallion.add(boss);

    medallion.position.set(2.4, -0.3, -1.5);
    medallion.rotation.x = 0.25;
    scene.add(medallion);

    let mouseX = 0;
    let mouseY = 0;
    function onPointerMove(e) {
      const rect = canvas.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    }
    window.addEventListener("pointermove", onPointerMove);

    let frameId;
    let t = 0;
    function animate() {
      frameId = requestAnimationFrame(animate);
      if (!prefersReducedMotion) {
        t += 0.004;
        medallion.rotation.y = t;
        medallion.position.y = -0.3 + Math.sin(t * 1.3) * 0.15;
        camera.position.x += (mouseX * 0.4 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.02;
        camera.lookAt(medallion.position);
      }
      renderer.render(scene, camera);
    }
    animate();

    function handleResize() {
      const { clientWidth, clientHeight } = canvas;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    }
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", onPointerMove);
      [discGeo, rimGeo, bossGeo].forEach((g) => g.dispose());
      medallion.children.forEach((c) => c.material?.dispose?.());
      renderer.dispose();
    };
  }, []);

  return (
    <div className="landing">
      <canvas ref={canvasRef} className="landing-canvas" />
      <div className="landing-content">
        <p className="landing-eyebrow">Application ledger</p>
        <h1 className="landing-title">
          Track every application.
          <br />
          Score every resume.
        </h1>
        <p className="landing-sub">
          Upload a resume, match it against any job description with AI, and
          keep every application moving from saved to offer — all in one
          place.
        </p>
        <button className="btn-primary landing-cta" onClick={() => navigate("/board")}>
          Open my tracker
        </button>
      </div>
    </div>
  );
}