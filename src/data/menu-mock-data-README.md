# Menu Mock Data Kullanım Kılavuzu

Bu dosya menü sistemi için mock data yapısını ve kullanımını açıklar.

## Dosyalar

### `menu-mock-data.js`
Ana menü mock data dosyası. Menü kategorileri ve öğeleri için veri yapılarını içerir:

- **Hasar Dosya**: Hasar dosyası işlemleri
- **Evrak Yönetimi**: Evrak yükleme ve yönetimi
- **Raporlar**: Çeşitli rapor türleri
- **Sistem Yönetimi**: Sistem ayarları ve kullanıcı yönetimi


## Menü Yapısı

### Kategoriler

```javascript
{
  id: 'hasar-dosya',
  translationKey: 'menuPage.categories.hasarDosya',
  icon: 'bi bi-file-earmark-medical',
  items: [...]
}
```

### Menü Öğeleri

```javascript
{
  id: 'hasar-dosya-sorgulama-arabulucu',
  translationKey: 'menuPage.items.hasarDosyaSorgulamaArabulucu',
  icon: 'bi bi-search',
  route: '/hasar-dosya-sorgula-arabulucu',
  quickAccess: true,
  description: 'Arabulucu olarak hasar dosyalarını sorgulayın'
}
```

## Kullanım

### 1. Temel Kullanım

```javascript
import { getMenuCategories } from 'src/data/menu-mock-data.js'

const categories = getMenuCategories()
console.log(categories)
```

### 2. Belirli Kategori Getirme

```javascript
import { getMenuCategoryById } from 'src/data/menu-mock-data.js'

const hasarCategory = getMenuCategoryById('hasarDosya')
console.log(hasarCategory.items)
```

### 3. Quick Access Öğeleri

```javascript
import { getQuickAccessItems } from 'src/data/menu-mock-data.js'

const quickAccessItems = getQuickAccessItems()
console.log(quickAccessItems)
```

### 4. Menü Arama

```javascript
import { searchMenuItems } from 'src/data/menu-mock-data.js'

const results = searchMenuItems('hasar')
console.log(results)
```

## Menü Kategorileri

### 1. Hasar Dosya
- **Hasar Dosya Sorgulama (Arabulucu)** - Quick Access ✅
- **Hasar Dosya Ekleme**
- **Hasar Dosya Listesi**
- **Hasar Dosya Raporları**

### 2. Evrak Yönetimi
- **Evrak Yükleme** - Quick Access ✅
- **Evrak Listesi**
- **Evrak Onay**

### 3. Raporlar
- **Günlük Rapor**
- **Aylık Rapor**
- **Özet Rapor** - Quick Access ✅

### 4. Sistem Yönetimi
- **Kullanıcı Yönetimi**
- **Yetki Yönetimi**
- **Sistem Ayarları**

## Özellikler

- ✅ **4 Ana Kategori**: Hasar Dosya, Evrak Yönetimi, Raporlar, Sistem Yönetimi
- ✅ **16 Menü Öğesi**: Her kategoride 3-4 öğe
- ✅ **Quick Access**: 3 öğe hızlı erişim için işaretli
- ✅ **Çoklu Dil**: Türkçe ve İngilizce çeviri desteği
- ✅ **Arama Fonksiyonu**: Menü öğelerinde arama
- ✅ **Rastgele Veri**: Test için dinamik menü öğesi üretimi
- ✅ **API Format**: Backend API response formatında mock data

## Çeviri Anahtarları

### Kategoriler
- `menuPage.categories.hasarDosya`
- `menuPage.categories.evrakYonetimi`
- `menuPage.categories.raporlar`
- `menuPage.categories.sistemYonetimi`

### Öğeler
- `menuPage.items.hasarDosyaSorgulamaArabulucu`
- `menuPage.items.evrakYukleme`
- `menuPage.items.gunlukRapor`
- `menuPage.items.kullaniciYonetimi`

## Route Yapısı

```javascript
// Hasar Dosya kategorisi
'/hasar-dosya-sorgula-arabulucu'
'/hasar-dosya-ekle'
'/hasar-dosya-listesi'
'/hasar-dosya-raporlari'

// Evrak Yönetimi kategorisi
'/evrak-yukle'
'/evrak-listesi'
'/evrak-onay'

// Raporlar kategorisi
'/raporlar/gunluk'
'/raporlar/aylik'
'/raporlar/ozet'

// Sistem Yönetimi kategorisi
'/sistem/kullanicilar'
'/sistem/yetkiler'
'/sistem/ayarlar'
```

## Geliştirme Ortamında Otomatik Kullanım

Menu store geliştirme ortamında (`NODE_ENV === 'development'`) otomatik olarak mock data kullanır. Production'da gerçek API çağrıları yapılır.

## Test

Menü mock data'yı test etmek için:

```javascript
import { exampleListCategories } from 'src/data/menu-mock-examples.js'

exampleListCategories() // Console'da menü kategorilerini gösterir
```

## Menü Store Entegrasyonu

Menu store otomatik olarak mock data'yı yükler:

```javascript
// Menu store'da otomatik yükleme
const loadMenuData = async () => {
  const mockCategories = getMenuCategories()
  menuCategories.value = mockCategories
}
```

## Önemli Notlar

1. **Hasar Dosya Sorgulama (Arabulucu)** öğesi Quick Access olarak işaretlenmiştir
2. Tüm menü öğeleri i18n çeviri anahtarları kullanır
3. Route yapısı tutarlı ve hiyerarşiktir
4. Mock data gerçekçi ve kullanılabilir veriler içerir
