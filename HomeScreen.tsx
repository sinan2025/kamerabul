import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { toast } from 'sonner-native';

// Scan result type definitions
interface ScanResult {
  status: 'safe' | 'suspicious' | 'danger';
  details: string;
}

interface ScanResults {
  ir: ScanResult | null;
  wifi: ScanResult | null;
  magnetic: ScanResult | null;
  audio: ScanResult | null;
  light: ScanResult | null;
}

export default function HomeScreen() {
  const [scanning, setScanning] = useState(false);
  const [activeScans, setActiveScans] = useState<string[]>([]);
  const [scanResults, setScanResults] = useState<ScanResults>({
    ir: null,
    wifi: null,
    magnetic: null,
    audio: null,
    light: null,
  });

  // Simulated scan functions
  const startScan = () => {
    if (scanning) return;
    
    setScanning(true);
    setScanResults({
      ir: null,
      wifi: null,
      magnetic: null,
      audio: null,
      light: null,
    });
    setActiveScans([]);
    
    toast.message('Tarama başlatıldı', {
      description: 'Tüm sensörler aktifleştiriliyor...',
      duration: 2000,
    });
    
    // Add each scan with a delay to simulate scanning
    setTimeout(() => setActiveScans(prev => [...prev, 'ir']), 500);
    setTimeout(() => setActiveScans(prev => [...prev, 'wifi']), 1000);
    setTimeout(() => setActiveScans(prev => [...prev, 'magnetic']), 1500);
    setTimeout(() => setActiveScans(prev => [...prev, 'audio']), 2000);
    setTimeout(() => setActiveScans(prev => [...prev, 'light']), 2500);
    
    // Simulate scan completions with random results
    setTimeout(() => completeScan('ir'), 3500);
    setTimeout(() => completeScan('wifi'), 5000);
    setTimeout(() => completeScan('magnetic'), 6000);
    setTimeout(() => completeScan('audio'), 7000);
    setTimeout(() => {
      completeScan('light');
      setScanning(false);
      toast.success('Tarama tamamlandı', {
        description: 'Tüm sensör sonuçları hazır.',
      });
    }, 8000);
  };
  
  const completeScan = (scanType: keyof ScanResults) => {
    setActiveScans(prev => prev.filter(scan => scan !== scanType));
    
    // Simulate random results for demo purposes
    const statuses: ('safe' | 'suspicious' | 'danger')[] = ['safe', 'suspicious', 'danger'];
    const randomStatus = statuses[Math.floor(Math.random() * 3)];
    let details = '';
    
    switch (scanType) {
      case 'ir':
        details = randomStatus === 'safe' 
          ? 'Kızılötesi ışık kaynağı tespit edilmedi.'
          : randomStatus === 'suspicious'
          ? 'Zayıf kızılötesi ışık kaynağı tespit edildi. Konum: Ön sağ köşe.'
          : 'Güçlü kızılötesi ışık kaynağı tespit edildi! Konum: Ön sağ köşe.';
        break;
      case 'wifi':
        details = randomStatus === 'safe' 
          ? 'Şüpheli Wi-Fi cihazları tespit edilmedi.'
          : randomStatus === 'suspicious'
          ? '2 tanımlanamayan cihaz tespit edildi. MAC: 00:1A:2B:3C:4D:5E'
          : 'Bilinen gözetleme cihazı MAC adresi tespit edildi! MAC: 00:1A:2B:3C:4D:5E';
        break;
      case 'magnetic':
        details = randomStatus === 'safe' 
          ? 'Anormal manyetik alan tespit edilmedi.'
          : randomStatus === 'suspicious'
          ? 'Hafif manyetik anomali tespit edildi. Konum: Sol duvar yakını.'
          : 'Güçlü manyetik alan tespit edildi! Muhtemel gizli cihaz. Konum: Sol duvar.';
        break;
      case 'audio':
        details = randomStatus === 'safe' 
          ? 'Ultrasonik ses frekansı tespit edilmedi.'
          : randomStatus === 'suspicious'
          ? '18kHz üzerinde şüpheli ses frekansı tespit edildi.'
          : '19-22kHz aralığında bilinen dinleme cihazı frekansı tespit edildi!';
        break;
      case 'light':
        details = randomStatus === 'safe' 
          ? 'Anormal ışık değişimi tespit edilmedi.'
          : randomStatus === 'suspicious'
          ? 'Hafif ışık değişimleri tespit edildi. Sebebi doğal olabilir.'
          : 'Belirgin ışık değişimleri tespit edildi! Gizli kamera lens yansıması olabilir.';
        break;
    }
    
    setScanResults(prev => ({
      ...prev,
      [scanType]: { status: randomStatus, details }
    }));
  };
  
  const startSingleScan = (scanType: keyof ScanResults) => {
    if (scanning) return;
    
    setScanning(true);
    setActiveScans([scanType]);
    
    // Reset only this scan result
    setScanResults(prev => ({
      ...prev,
      [scanType]: null
    }));
    
    toast.message(`${getScanTitle(scanType)} başlatıldı`, {
      duration: 2000,
    });
    
    // Simulate scan completion
    setTimeout(() => {
      completeScan(scanType);
      setActiveScans([]);
      setScanning(false);
      toast.success(`${getScanTitle(scanType)} tamamlandı`);
    }, 3000);
  };
  
  const getScanTitle = (scanType: string): string => {
    switch (scanType) {
      case 'ir': return 'IR Kamera Taraması';
      case 'wifi': return 'Wi-Fi Ağ Taraması';
      case 'magnetic': return 'Manyetik Alan Taraması';
      case 'audio': return 'Ses Frekans Analizi';
      case 'light': return 'Ortam Işığı İzleme';
      default: return 'Tarama';
    }
  };
  
  const getScanIcon = (scanType: string) => {
    switch (scanType) {
      case 'ir': return <MaterialIcons name="camera" size={24} color="#FF5722" />;
      case 'wifi': return <Ionicons name="wifi" size={24} color="#2196F3" />;
      case 'magnetic': return <MaterialCommunityIcons name="magnet" size={24} color="#673AB7" />;
      case 'audio': return <MaterialIcons name="mic" size={24} color="#4CAF50" />;
      case 'light': return <Ionicons name="flashlight" size={24} color="#FFC107" />;
      default: return <MaterialIcons name="error" size={24} color="#F44336" />;
    }
  };
  
  const getStatusColor = (status: string | null) => {
    if (!status) return '#9e9e9e';
    switch (status) {
      case 'safe': return '#4CAF50';
      case 'suspicious': return '#FF9800';
      case 'danger': return '#F44336';
      default: return '#9e9e9e';
    }
  };

  const getStatusText = (status: string | null) => {
    if (!status) return 'Bekliyor';
    switch (status) {
      case 'safe': return 'Güvenli';
      case 'suspicious': return 'Şüpheli';
      case 'danger': return 'Tehlike!';
      default: return 'Bekliyor';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Gizlilik Tarama</Text>
        <Text style={styles.headerSubtitle}>Gözetleme Cihazı Tespit Sistemi</Text>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.quickScanCard}>
          <View style={styles.quickScanHeader}>
            <Text style={styles.quickScanTitle}>Hızlı Tarama</Text>
            <Text style={styles.quickScanSubtitle}>Tüm sensörlerle tarama başlat</Text>
          </View>
          
          <TouchableOpacity 
            style={[styles.scanButton, scanning && styles.scanningButton]}
            onPress={startScan}
            disabled={scanning}
          >
            {scanning ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <MaterialIcons name="security" size={28} color="#fff" />
            )}
            <Text style={styles.scanButtonText}>
              {scanning ? 'Taranıyor...' : 'Tam Tarama Başlat'}
            </Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Detaylı Tarama Sonuçları</Text>
        
        {/* IR Camera Detection */}
        <View style={styles.scanCard}>
          <View style={styles.scanCardHeader}>
            {getScanIcon('ir')}
            <Text style={styles.scanCardTitle}>IR Kamera Tespiti</Text>
          </View>
          
          <View style={styles.scanCardContent}>
            {activeScans.includes('ir') ? (
              <View style={styles.scanningIndicator}>
                <ActivityIndicator color="#FF5722" />
                <Text style={styles.scanningText}>Kızılötesi tarama yapılıyor...</Text>
              </View>
            ) : scanResults.ir ? (
              <View style={styles.resultContainer}>
                <View style={styles.statusIndicator}>
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(scanResults.ir.status) }]} />
                  <Text style={[styles.statusText, { color: getStatusColor(scanResults.ir.status) }]}>
                    {getStatusText(scanResults.ir.status)}
                  </Text>
                </View>
                <Text style={styles.resultDetails}>{scanResults.ir.details}</Text>
              </View>
            ) : (
              <Text style={styles.noScanText}>Henüz tarama yapılmadı</Text>
            )}
          </View>
          
          <TouchableOpacity 
            style={[styles.singleScanButton, activeScans.includes('ir') && styles.activeScanButton]}
            onPress={() => startSingleScan('ir')}
            disabled={scanning}
          >
            <Text style={styles.singleScanButtonText}>
              {activeScans.includes('ir') ? 'Taranıyor...' : 'Tekrar Tara'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* WiFi Network Scan */}
        <View style={styles.scanCard}>
          <View style={styles.scanCardHeader}>
            {getScanIcon('wifi')}
            <Text style={styles.scanCardTitle}>Wi-Fi Ağ Taraması</Text>
          </View>
          
          <View style={styles.scanCardContent}>
            {activeScans.includes('wifi') ? (
              <View style={styles.scanningIndicator}>
                <ActivityIndicator color="#2196F3" />
                <Text style={styles.scanningText}>Wi-Fi ağları taranıyor...</Text>
              </View>
            ) : scanResults.wifi ? (
              <View style={styles.resultContainer}>
                <View style={styles.statusIndicator}>
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(scanResults.wifi.status) }]} />
                  <Text style={[styles.statusText, { color: getStatusColor(scanResults.wifi.status) }]}>
                    {getStatusText(scanResults.wifi.status)}
                  </Text>
                </View>
                <Text style={styles.resultDetails}>{scanResults.wifi.details}</Text>
              </View>
            ) : (
              <Text style={styles.noScanText}>Henüz tarama yapılmadı</Text>
            )}
          </View>
          
          <TouchableOpacity 
            style={[styles.singleScanButton, activeScans.includes('wifi') && styles.activeScanButton]}
            onPress={() => startSingleScan('wifi')}
            disabled={scanning}
          >
            <Text style={styles.singleScanButtonText}>
              {activeScans.includes('wifi') ? 'Taranıyor...' : 'Tekrar Tara'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Magnetic Field Scan */}
        <View style={styles.scanCard}>
          <View style={styles.scanCardHeader}>
            {getScanIcon('magnetic')}
            <Text style={styles.scanCardTitle}>Manyetik Alan Taraması</Text>
          </View>
          
          <View style={styles.scanCardContent}>
            {activeScans.includes('magnetic') ? (
              <View style={styles.scanningIndicator}>
                <ActivityIndicator color="#673AB7" />
                <Text style={styles.scanningText}>Manyetik alanlar taranıyor...</Text>
              </View>
            ) : scanResults.magnetic ? (
              <View style={styles.resultContainer}>
                <View style={styles.statusIndicator}>
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(scanResults.magnetic.status) }]} />
                  <Text style={[styles.statusText, { color: getStatusColor(scanResults.magnetic.status) }]}>
                    {getStatusText(scanResults.magnetic.status)}
                  </Text>
                </View>
                <Text style={styles.resultDetails}>{scanResults.magnetic.details}</Text>
              </View>
            ) : (
              <Text style={styles.noScanText}>Henüz tarama yapılmadı</Text>
            )}
          </View>
          
          <TouchableOpacity 
            style={[styles.singleScanButton, activeScans.includes('magnetic') && styles.activeScanButton]}
            onPress={() => startSingleScan('magnetic')}
            disabled={scanning}
          >
            <Text style={styles.singleScanButtonText}>
              {activeScans.includes('magnetic') ? 'Taranıyor...' : 'Tekrar Tara'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Audio Frequency Analysis */}
        <View style={styles.scanCard}>
          <View style={styles.scanCardHeader}>
            {getScanIcon('audio')}
            <Text style={styles.scanCardTitle}>Ses Frekans Analizi</Text>
          </View>
          
          <View style={styles.scanCardContent}>
            {activeScans.includes('audio') ? (
              <View style={styles.scanningIndicator}>
                <ActivityIndicator color="#4CAF50" />
                <Text style={styles.scanningText}>Ses frekansları analiz ediliyor...</Text>
              </View>
            ) : scanResults.audio ? (
              <View style={styles.resultContainer}>
                <View style={styles.statusIndicator}>
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(scanResults.audio.status) }]} />
                  <Text style={[styles.statusText, { color: getStatusColor(scanResults.audio.status) }]}>
                    {getStatusText(scanResults.audio.status)}
                  </Text>
                </View>
                <Text style={styles.resultDetails}>{scanResults.audio.details}</Text>
              </View>
            ) : (
              <Text style={styles.noScanText}>Henüz tarama yapılmadı</Text>
            )}
          </View>
          
          <TouchableOpacity 
            style={[styles.singleScanButton, activeScans.includes('audio') && styles.activeScanButton]}
            onPress={() => startSingleScan('audio')}
            disabled={scanning}
          >
            <Text style={styles.singleScanButtonText}>
              {activeScans.includes('audio') ? 'Taranıyor...' : 'Tekrar Tara'}
            </Text>
          </TouchableOpacity>
        </View>
        
        {/* Ambient Light Monitoring */}
        <View style={styles.scanCard}>
          <View style={styles.scanCardHeader}>
            {getScanIcon('light')}
            <Text style={styles.scanCardTitle}>Ortam Işığı İzleme</Text>
          </View>
          
          <View style={styles.scanCardContent}>
            {activeScans.includes('light') ? (
              <View style={styles.scanningIndicator}>
                <ActivityIndicator color="#FFC107" />
                <Text style={styles.scanningText}>Ortam ışığı değişimleri izleniyor...</Text>
              </View>
            ) : scanResults.light ? (
              <View style={styles.resultContainer}>
                <View style={styles.statusIndicator}>
                  <View style={[styles.statusDot, { backgroundColor: getStatusColor(scanResults.light.status) }]} />
                  <Text style={[styles.statusText, { color: getStatusColor(scanResults.light.status) }]}>
                    {getStatusText(scanResults.light.status)}
                  </Text>
                </View>
                <Text style={styles.resultDetails}>{scanResults.light.details}</Text>
              </View>
            ) : (
              <Text style={styles.noScanText}>Henüz tarama yapılmadı</Text>
            )}
          </View>
          
          <TouchableOpacity 
            style={[styles.singleScanButton, activeScans.includes('light') && styles.activeScanButton]}
            onPress={() => startSingleScan('light')}
            disabled={scanning}
          >
            <Text style={styles.singleScanButtonText}>
              {activeScans.includes('light') ? 'Taranıyor...' : 'Tekrar Tara'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Bu uygulama, gizli gözetleme cihazlarını tespit etmek için tasarlanmıştır.
            Düzenli tarama yaparak gizliliğinizi koruyabilirsiniz.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#1565C0',
    padding: 20,
    alignItems: 'center',
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  quickScanCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickScanHeader: {
    marginBottom: 16,
  },
  quickScanTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  quickScanSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  scanButton: {
    backgroundColor: '#1565C0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 10,
  },
  scanningButton: {
    backgroundColor: '#7986CB',
  },
  scanButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
    marginBottom: 15,
  },
  scanCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  scanCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  scanCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  scanCardContent: {
    minHeight: 80,
    justifyContent: 'center',
  },
  scanningIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanningText: {
    marginLeft: 10,
    color: '#666',
    fontStyle: 'italic',
  },
  resultContainer: {
    paddingVertical: 4,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  resultDetails: {
    color: '#333',
    lineHeight: 20,
  },
  noScanText: {
    textAlign: 'center',
    color: '#9e9e9e',
    fontStyle: 'italic',
  },
  singleScanButton: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  activeScanButton: {
    backgroundColor: '#E0E0E0',
  },
  singleScanButtonText: {
    color: '#333',
    fontWeight: '500',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    marginTop: 10,
    marginBottom: 20,
  },
  footerText: {
    textAlign: 'center',
    color: '#757575',
    fontSize: 12,
    lineHeight: 18,
  }
});