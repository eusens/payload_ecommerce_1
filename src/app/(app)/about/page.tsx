import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export const metadata = {
  title: 'About Us - Eusens Automation',
  description: 'Professional automation distributor based in Vietnam, serving Food & Beverage, Cement, Mining, Oil & Gas, and more.',
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">About Eusens</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Your trusted partner in industrial automation solutions
        </p>
      </div>

      {/* Company Introduction */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            An automation distributor based in Vietnam. Eusens is a professional supplier serving various 
            industries including Food & Beverage, Cement, Mining, Oil & Gas, Port Cranes, and On-shore/Off-shore Cranes.
          </p>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Our main products are: distributed control system (DCS), programmable logic controller (PLC), 
            large servo control system.
          </p>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            The spare parts we sell are guaranteed for one year and are rigorously tested and certified.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We are now a global manufacturer of industrial automation spare parts and components.
          </p>
        </div>
        <div className="bg-muted rounded-lg overflow-hidden flex items-center justify-center min-h-[300px]">
          {/* 替换为你的图片路径 */}
          <Image
            src="https://eusens.com/wp-content/uploads/2019/12/FACEBOOK-COVER.gif"
            alt="Eusens Automation"
            width={600}
            height={400}
            className="object-cover w-full h-full"
          />
        </div>
      </div>

      {/* Product Categories */}
      <div className="mb-16">
        <h2 className="text-2xl font-semibold mb-8 text-center">Our Product Lines</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Rockwell Automation */}
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-primary">Rockwell Automation</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• ControlLogix 1756 series controller</li>
              <li>• CompactLogix 1769 series controller</li>
              <li>• SLC 500 1747 1746 Series Controller</li>
              <li>• PLC-5 1771 1785 series controller</li>
              <li>• ProSoft: MVI69/PS69/MVI56/MVI94/MVI71/MVI46/3150</li>
              <li>• ICS TRIPLEX trusted system</li>
            </ul>
          </div>

          {/* ABB */}
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-primary">ABB</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• AC800M series controller I/O module</li>
              <li>• AC800F series controller module</li>
              <li>• AC31 series controller module</li>
              <li>• 800xA series modules</li>
              <li>• Bailey INFI 90 module</li>
              <li>• DSQC robot module spare parts</li>
              <li>• Advant OCS system spare parts</li>
              <li>• H&B Freelance</li>
            </ul>
          </div>

          {/* Bentley Nevada */}
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-primary">Bentley Nevada</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Bently 3500 Monitoring system</li>
              <li>• Bently 3300 Monitoring system</li>
            </ul>
          </div>

          {/* Schneider Electric */}
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-primary">Schneider Electric</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Quantum 140 series: Modicon M340</li>
              <li>• Modicon Premium: CPU Processor Module, Communication module, etc</li>
            </ul>
          </div>

          {/* Emerson */}
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-primary">Emerson</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Ovation System DCS Card</li>
              <li>• DeltaV system Dual Channel Redundancy Safety System, Redundancy Controller</li>
            </ul>
          </div>

          {/* General Electric */}
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-primary">General Electric</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• IS200/DS200 series Excitation system card</li>
              <li>• IC693/IC695/IC697/IC698/IC200/IC660/IC670 CPU module, Communication module, Analog Digital module</li>
            </ul>
          </div>

          {/* Triconex & Foxboro */}
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-primary">Triconex & Foxboro</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Triconex Card: Tricon System Card</li>
              <li>• Foxboro: I/A Series System Module</li>
            </ul>
          </div>

          {/* Honeywell */}
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-primary">Honeywell</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Alcont</li>
              <li>• Experion LS</li>
              <li>• Experion PKS</li>
              <li>• Experion HS</li>
              <li>• Plant Scape</li>
              <li>• TDC 2000</li>
              <li>• TDC3000</li>
              <li>• TPS</li>
            </ul>
          </div>

          {/* Siemens */}
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-primary">Siemens</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Siemens MOORE</li>
              <li>• Siemens S5</li>
            </ul>
          </div>

          {/* Yokogawa */}
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-primary">Yokogawa</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• CS3000 System CPU Controller Module, Analog Module</li>
            </ul>
          </div>

          {/* Yaskawa */}
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-primary">Yaskawa</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Robot Servo Controller, Servo Motor, Servo Drive</li>
            </ul>
          </div>

          {/* Rexroth Indramat */}
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-primary">Rexroth Indramat</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• I/O module, PLC controller, drive module</li>
            </ul>
          </div>

          {/* VIBRO-METER */}
          <div className="border rounded-lg p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-3 text-primary">VIBRO-METER</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• VM600 MPC4, VM600 CMC16, VM600 IOC4T</li>
              <li>• Vibration Sensor, Speed Sensor, Vortex Sensor</li>
              <li>• Monitoring System Module Gateway Communication Module</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Advantages Section */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <div className="bg-primary/5 rounded-lg p-8 text-center">
          <div className="text-3xl mb-3">✅</div>
          <h3 className="text-xl font-semibold mb-2">Global Sourcing</h3>
          <p className="text-muted-foreground">
            Our company directly purchases goods from abroad, ensuring authentic and high-quality products.
          </p>
        </div>
        <div className="bg-primary/5 rounded-lg p-8 text-center">
          <div className="text-3xl mb-3">🌍</div>
          <h3 className="text-xl font-semibold mb-2">Worldwide Supply</h3>
          <p className="text-muted-foreground">
            We can provide equipment and spare parts from different countries and manufacturers, solving your sourcing challenges.
          </p>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="text-center bg-muted rounded-lg p-10">
        <h2 className="text-2xl font-semibold mb-4">Need More Information?</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Welcome to contact us to get more product detail information. We're here to help you find the right solution.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 transition-colors"
        >
          Contact Us
        </Link>
      </div>
    </div>
  )
}