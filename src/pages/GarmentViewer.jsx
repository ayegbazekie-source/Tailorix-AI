import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import * as THREE from 'three';
import { 
  ArrowLeft,
  RotateCcw,
  Check,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function GarmentViewer() {
  const [session, setSession] = useState(null);
  const [fabric, setFabric] = useState(null);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationRef = useRef(null);

  const urlParams = new URLSearchParams(window.location.search);
  const sessionId = urlParams.get('session');

  useEffect(() => {
    loadData();
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (!loading && containerRef.current && session) {
      initThreeJS();
    }
  }, [loading, session]);

  const loadData = async () => {
    try {
      if (sessionId) {
        const [sessionData] = await base44.entities.SewingSession.filter({ id: sessionId });
        setSession(sessionData);

        if (sessionData?.fabric_id) {
          const [fabricData] = await base44.entities.Fabric.filter({ id: sessionData.fabric_id });
          setFabric(fabricData);
        }
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const initThreeJS = () => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1e293b);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(-5, -5, 5);
    scene.add(pointLight);

    // Fabric color based on type
    const fabricColor = fabric?.name?.toLowerCase().includes('denim') ? 0x3b5998 :
                        fabric?.name?.toLowerCase().includes('silk') ? 0xfce4ec :
                        fabric?.name?.toLowerCase().includes('cotton') ? 0xf5f5f5 :
                        fabric?.name?.toLowerCase().includes('wool') ? 0x8b7355 :
                        0xe8e8e8;

    // Create fabric plane with wave
    const fabricGeometry = new THREE.PlaneGeometry(4, 3, 64, 48);
    const positions = fabricGeometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      positions[i + 2] = Math.sin(positions[i] * 2) * 0.05 + Math.cos(positions[i + 1] * 2) * 0.03;
    }
    fabricGeometry.computeVertexNormals();

    const fabricMaterial = new THREE.MeshStandardMaterial({
      color: fabricColor,
      side: THREE.DoubleSide,
      roughness: 0.8,
      metalness: 0.1
    });

    const fabricMesh = new THREE.Mesh(fabricGeometry, fabricMaterial);
    scene.add(fabricMesh);

    // Create stitch line
    if (session?.stitch_data?.path_points && session.stitch_data.path_points.length > 1) {
      const stitchPoints = session.stitch_data.path_points.map(p => 
        new THREE.Vector3((p.x - 340) / 100, -(p.y - 200) / 100, 0.05)
      );
      
      const stitchCurve = new THREE.CatmullRomCurve3(stitchPoints);
      const stitchGeometry = new THREE.TubeGeometry(stitchCurve, 64, 0.02, 8, false);
      
      const quality = session.accuracy_score || 70;
      const stitchColor = quality >= 80 ? 0x10b981 : quality >= 60 ? 0xf59e0b : 0xef4444;
      
      const stitchMaterial = new THREE.MeshStandardMaterial({
        color: stitchColor,
        roughness: 0.4
      });
      
      const stitchMesh = new THREE.Mesh(stitchGeometry, stitchMaterial);
      scene.add(stitchMesh);
    }

    // Add seam edges
    const seamGeometry = new THREE.PlaneGeometry(4, 0.1);
    const seamMaterial = new THREE.MeshStandardMaterial({ color: 0x374151, roughness: 0.9 });
    
    const topSeam = new THREE.Mesh(seamGeometry, seamMaterial);
    topSeam.position.set(0, 1.4, 0.01);
    scene.add(topSeam);
    
    const bottomSeam = new THREE.Mesh(seamGeometry, seamMaterial);
    bottomSeam.position.set(0, -1.4, 0.01);
    scene.add(bottomSeam);

    // Mouse controls for rotation
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let rotation = { x: 0, y: 0 };

    const onMouseDown = (e) => {
      isDragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      
      const deltaX = e.clientX - previousMousePosition.x;
      const deltaY = e.clientY - previousMousePosition.y;
      
      rotation.y += deltaX * 0.01;
      rotation.x += deltaY * 0.01;
      
      fabricMesh.rotation.y = rotation.y;
      fabricMesh.rotation.x = rotation.x;
      
      previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e) => {
      camera.position.z += e.deltaY * 0.01;
      camera.position.z = Math.max(2, Math.min(10, camera.position.z));
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mousemove', onMouseMove);
    renderer.domElement.addEventListener('mouseup', onMouseUp);
    renderer.domElement.addEventListener('mouseleave', onMouseUp);
    renderer.domElement.addEventListener('wheel', onWheel);

    // Animation loop
    const animate = () => {
      animationRef.current = requestAnimationFrame(animate);
      
      // Subtle breathing animation
      fabricMesh.position.y = Math.sin(Date.now() * 0.001) * 0.02;
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mousemove', onMouseMove);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.domElement.removeEventListener('mouseleave', onMouseUp);
      renderer.domElement.removeEventListener('wheel', onWheel);
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <div className="border-b border-slate-700 bg-slate-900/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl('Results') + `?session=${sessionId}`}>
              <Button variant="ghost" className="text-slate-400 hover:text-white -ml-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Results
              </Button>
            </Link>
            <Badge variant="outline" className="border-slate-600 text-slate-300">
              3D Preview
            </Badge>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-[calc(100vh-73px)]">
        {/* 3D Viewer */}
        <div className="flex-1 relative">
          <div ref={containerRef} className="w-full h-full" />
          
          {/* Controls Overlay */}
          <div className="absolute bottom-6 left-6 right-6 flex justify-center">
            <div className="bg-slate-800/90 backdrop-blur-sm rounded-2xl px-6 py-3 flex items-center gap-4 border border-slate-700">
              <span className="text-slate-400 text-sm">Drag to rotate • Scroll to zoom</span>
            </div>
          </div>
        </div>

        {/* Info Panel */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full lg:w-96 bg-slate-800/50 border-l border-slate-700 p-6 overflow-y-auto"
        >
          <h2 className="text-xl font-bold text-white mb-6">Stitch Analysis</h2>

          {session && (
            <div className="space-y-6">
              {/* Fabric Info */}
              <div className="p-4 bg-slate-700/30 rounded-2xl">
                <h3 className="text-sm font-medium text-slate-400 mb-2">Fabric</h3>
                <p className="text-lg text-white font-semibold">{fabric?.name || 'Unknown'}</p>
                <p className="text-sm text-slate-400 mt-1">{fabric?.description}</p>
              </div>

              {/* Quality Indicators */}
              <div className="space-y-4">
                <QualityIndicator 
                  label="Stitch Accuracy" 
                  value={session.accuracy_score || 0}
                  description="How well you followed the guide line"
                />
                <QualityIndicator 
                  label="Seam Straightness" 
                  value={Math.max(0, 100 - (session.stitch_data?.drift_events || 0) * 5)}
                  description="Consistency of your stitch path"
                />
                <QualityIndicator 
                  label="Stitch Density" 
                  value={Math.min(100, (session.stitch_data?.total_stitches || 0) * 2)}
                  description="Number of stitches per length"
                />
              </div>

              {/* Comparison */}
              <div className="p-4 bg-slate-700/30 rounded-2xl">
                <h3 className="text-sm font-medium text-slate-400 mb-4">Comparison</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-slate-600/30 rounded-xl">
                    <Check className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">Good Seam</p>
                    <p className="text-sm text-white mt-1">Straight, even</p>
                  </div>
                  <div className="text-center p-3 bg-slate-600/30 rounded-xl">
                    <X className="w-6 h-6 text-rose-400 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">Poor Seam</p>
                    <p className="text-sm text-white mt-1">Wavy, uneven</p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 pt-4">
                <Link to={createPageUrl('SewingSimulator') + `?mode=${session.mode}&fabric=${session.fabric_id}&stitch=${session.stitch_type_id}&length=${session.stitch_length}`}>
                  <Button className="w-full rounded-xl bg-rose-500 hover:bg-rose-600">
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Practice Again
                  </Button>
                </Link>
                <Link to={createPageUrl('ModeSelect')}>
                  <Button variant="outline" className="w-full rounded-xl border-slate-600 text-slate-300 hover:bg-slate-700">
                    New Session
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

function QualityIndicator({ label, value, description }) {
  const getColor = (v) => {
    if (v >= 80) return 'bg-emerald-500';
    if (v >= 60) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-slate-300">{label}</span>
        <span className="text-sm font-bold text-white">{value}%</span>
      </div>
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full ${getColor(value)} rounded-full`}
        />
      </div>
      <p className="text-xs text-slate-500 mt-1">{description}</p>
    </div>
  );
}