import "../styles/PdfExport.css";
import React from "react";
import jsPDF from "jspdf";

const PdfExport = ({ tripDetails }) => {
  const {
    journeyName,
    driverName,
    fuelCost,
    mpg,
    distance,
    passengers,
    driverContributes,
    driverContributionPercentage,
    otherCosts,
    totalFuelCost,
    totalOtherCosts,
    totalTripCost,
    costPerPerson,
    driverCost,
    passengerCost,
  } = tripDetails;

  // Color palette
  const colors = {
    beige: [242, 212, 146], // #f2d492 in RGB
    green: [184, 176, 141], // #b8b08d in RGB
    purple: [71, 64, 86], // #474056 in RGB
    lightBeige: [249, 236, 206], // Lighter version of beige for backgrounds
    white: [255, 255, 255],
  };

  const generatePDF = () => {
    // Create new document (A4 format by default)
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;

    // Add page background
    doc.setFillColor(249, 236, 206); // Light beige background
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Add header bar
    doc.setFillColor(...colors.purple);
    doc.rect(0, 0, pageWidth, 30, "F");

    // Add title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(...colors.white);
    doc.text("Journey Cost Summary", pageWidth / 2, 19, { align: "center" });

    // Add date
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(...colors.lightBeige);
    doc.text(
      `Generated: ${new Date().toLocaleDateString()}`,
      pageWidth - margin,
      12,
      { align: "right" }
    );

    // Journey Details Section Header
    let yPosition = 38; // Even less space after header
    doc.setFillColor(...colors.green);
    doc.rect(margin, yPosition, pageWidth - margin * 2, 6, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...colors.purple);
    doc.text("JOURNEY DETAILS", margin + 5, yPosition + 4);
    yPosition += 10; // Minimal spacing after section header

    // Journey information - Two-column layout
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...colors.purple);

    const colWidth = (pageWidth - margin * 2) / 2;
    const lineHeight = 6; // Ultra-compact line height

    // Left column
    doc.text(`Journey:`, margin, yPosition);
    doc.setFont("helvetica", "bold");
    doc.text(`${journeyName || "Not specified"}`, margin + 40, yPosition);
    yPosition += lineHeight;

    doc.setFont("helvetica", "normal");
    doc.text(`Driver:`, margin, yPosition);
    doc.setFont("helvetica", "bold");
    doc.text(`${driverName || "Not specified"}`, margin + 40, yPosition);
    yPosition += lineHeight;

    doc.setFont("helvetica", "normal");
    doc.text(`Passengers:`, margin, yPosition);
    doc.setFont("helvetica", "bold");
    doc.text(`${passengers || 0}`, margin + 40, yPosition);
    yPosition += lineHeight;

    doc.setFont("helvetica", "normal");
    doc.text(`Total travelers:`, margin, yPosition);
    doc.setFont("helvetica", "bold");
    doc.text(`${parseInt(passengers) + 1 || 1}`, margin + 40, yPosition);

    // Right column
    const rightColX = margin + colWidth;
    let rightYPosition = yPosition - lineHeight * 3; // Start at same height as left column

    doc.setFont("helvetica", "normal");
    doc.text(`Distance:`, rightColX, rightYPosition);
    doc.setFont("helvetica", "bold");
    doc.text(`${distance || 0} miles`, rightColX + 40, rightYPosition);
    rightYPosition += lineHeight;

    doc.setFont("helvetica", "normal");
    doc.text(`Vehicle MPG:`, rightColX, rightYPosition);
    doc.setFont("helvetica", "bold");
    doc.text(`${mpg || 0}`, rightColX + 40, rightYPosition);
    rightYPosition += lineHeight;

    doc.setFont("helvetica", "normal");
    doc.text(`Fuel Price:`, rightColX, rightYPosition);
    doc.setFont("helvetica", "bold");
    doc.text(`£${fuelCost || 0}/L`, rightColX + 40, rightYPosition);
    rightYPosition += lineHeight;

    // Driver contribution if applicable
    if (parseInt(passengers) > 0) {
      doc.setFont("helvetica", "normal");
      doc.text(`Driver contribution:`, rightColX, rightYPosition);
      doc.setFont("helvetica", "bold");

      let contributionText = "";
      if (!driverContributes) {
        contributionText = "None";
      } else if (driverContributionPercentage < 100) {
        contributionText = `${driverContributionPercentage}%`;
      } else {
        contributionText = "Equal share";
      }

      doc.text(contributionText, rightColX + 40, rightYPosition);
    }

    // Cost Breakdown Section - minimal spacing
    yPosition += 8; // Ultra-minimal spacing
    doc.setFillColor(...colors.green);
    doc.rect(margin, yPosition, pageWidth - margin * 2, 6, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...colors.purple);
    doc.text("COST BREAKDOWN", margin + 5, yPosition + 4);
    yPosition += 8;

    // Ultra-compact cost boxes
    const boxWidth = pageWidth - margin * 2;
    const boxHeight = 12; // Even shorter box height
    const boxPadding = 3; // Padding inside boxes
    const boxSpacing = 1; // Minimal spacing between boxes

    // Fuel cost box
    doc.setFillColor(...colors.beige);
    doc.rect(margin, yPosition, boxWidth, boxHeight, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...colors.purple);
    doc.text("Fuel Cost:", margin + boxPadding, yPosition + 8);

    doc.setFont("helvetica", "bold");
    doc.text(
      `£${totalFuelCost.toFixed(2)}`,
      pageWidth - margin - boxPadding,
      yPosition + 8,
      { align: "right" }
    );
    yPosition += boxHeight + boxSpacing;

    // Handle other costs even more efficiently
    if (otherCosts.length > 0) {
      // If many other costs, use a 3-column layout
      if (otherCosts.length > 8) {
        const gridCols = 3;
        const itemsPerCol = Math.ceil(otherCosts.length / gridCols);
        const gridColWidth = boxWidth / gridCols;

        // Background for other costs section
        doc.setFillColor(...colors.lightBeige);
        const gridHeight =
          Math.ceil(otherCosts.length / gridCols) * lineHeight + 10; // Added 8 points more space
        doc.rect(margin, yPosition, boxWidth, gridHeight, "F");

        // "Other Costs" label at the top - with more space below it
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(...colors.purple);
        doc.text("Other Costs:", margin + boxPadding, yPosition + 6);
        yPosition += 10; // Increased from 8 to 10 to add more space

        // Draw costs in a compact 3-column grid
        for (let i = 0; i < otherCosts.length; i++) {
          const cost = otherCosts[i];
          const colIndex = Math.floor(i / itemsPerCol);
          const rowIndex = i % itemsPerCol;

          const xPos = margin + 4 + colIndex * gridColWidth;
          const yPos = yPosition + rowIndex * lineHeight;

          doc.setFont("helvetica", "normal");
          doc.setFontSize(8); // Even smaller for the grid
          doc.text(`${cost.description}:`, xPos, yPos);

          doc.setFont("helvetica", "bold");
          doc.text(
            `£${parseFloat(cost.amount).toFixed(2)}`,
            xPos + gridColWidth - 10,
            yPos,
            { align: "right" }
          );
        }

        yPosition +=
          Math.ceil(otherCosts.length / gridCols) * lineHeight + boxSpacing;
      } else {
        // For fewer costs, we can use a 2-column layout
        const gridCols = 2;
        const itemsPerCol = Math.ceil(otherCosts.length / gridCols);
        const gridColWidth = boxWidth / gridCols;

        // Background
        doc.setFillColor(...colors.lightBeige);
        doc.rect(
          margin,
          yPosition,
          boxWidth,
          Math.ceil(otherCosts.length / gridCols) * lineHeight + 10,
          "F"
        ); // Added 8 more points

        // Header - with more space below
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.text("Other Costs:", margin + boxPadding, yPosition + 6);
        yPosition += 10; // Increased from 8 to 10 to add more space

        // Draw costs in a 2-column grid
        for (let i = 0; i < otherCosts.length; i++) {
          const cost = otherCosts[i];
          const colIndex = Math.floor(i / itemsPerCol);
          const rowIndex = i % itemsPerCol;

          const xPos = margin + 4 + colIndex * gridColWidth;
          const yPos = yPosition + rowIndex * lineHeight;

          doc.setFont("helvetica", "normal");
          doc.setFontSize(8);
          doc.text(`${cost.description}:`, xPos, yPos);

          doc.setFont("helvetica", "bold");
          doc.text(
            `£${parseFloat(cost.amount).toFixed(2)}`,
            xPos + gridColWidth - 10,
            yPos,
            { align: "right" }
          );
        }

        yPosition += Math.ceil(otherCosts.length / gridCols) * lineHeight + 2;
      }

      // Other costs total
      doc.setFillColor(...colors.green);
      doc.rect(margin, yPosition, boxWidth, boxHeight, "F");

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(...colors.white);
      doc.text("Other Costs Total:", margin + boxPadding, yPosition + 8);

      doc.setFont("helvetica", "bold");
      doc.text(
        `£${totalOtherCosts.toFixed(2)}`,
        pageWidth - margin - boxPadding,
        yPosition + 8,
        { align: "right" }
      );
      yPosition += boxHeight + boxSpacing;
    }

    // Total trip cost
    doc.setFillColor(...colors.purple);
    doc.rect(margin, yPosition, boxWidth, boxHeight + 2, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...colors.white);
    doc.text("TOTAL TRIP COST:", margin + boxPadding, yPosition + 9);

    doc.setFontSize(10);
    doc.text(
      `£${totalTripCost.toFixed(2)}`,
      pageWidth - margin - boxPadding,
      yPosition + 9,
      { align: "right" }
    );
    yPosition += boxHeight + 6;

    // Cost distribution section (if there are passengers)
    if (parseInt(passengers) > 0) {
      doc.setFillColor(...colors.green);
      doc.rect(margin, yPosition, pageWidth - margin * 2, 6, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...colors.purple);
      doc.text("COST DISTRIBUTION", margin + 5, yPosition + 4);
      yPosition += 8;

      if (!driverContributes || driverContributionPercentage < 100) {
        // Driver payment
        doc.setFillColor(...colors.beige);
        doc.rect(margin, yPosition, boxWidth, boxHeight, "F");

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...colors.purple);
        doc.text("Driver pays:", margin + boxPadding, yPosition + 8);

        doc.setFont("helvetica", "bold");
        doc.text(
          `£${driverCost.toFixed(2)}`,
          pageWidth - margin - boxPadding,
          yPosition + 8,
          { align: "right" }
        );
        yPosition += boxHeight + boxSpacing;

        // Passenger payment - FIXED: Using same beige color as driver payment box
        doc.setFillColor(...colors.beige); // Changed from lightBeige to beige to match driver box
        doc.rect(margin, yPosition, boxWidth, boxHeight, "F");

        doc.setFont("helvetica", "normal");
        doc.setTextColor(...colors.purple);
        doc.text("Each passenger pays:", margin + boxPadding, yPosition + 8);

        doc.setFont("helvetica", "bold");
        doc.text(
          `£${passengerCost.toFixed(2)}`,
          pageWidth - margin - boxPadding,
          yPosition + 8,
          { align: "right" }
        );
      } else {
        // Equal cost per person
        doc.setFillColor(...colors.beige);
        doc.rect(margin, yPosition, boxWidth, boxHeight, "F");

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(...colors.purple);
        doc.text("Cost per person:", margin + boxPadding, yPosition + 8);

        doc.setFont("helvetica", "bold");
        doc.text(
          `£${costPerPerson.toFixed(2)}`,
          pageWidth - margin - boxPadding,
          yPosition + 8,
          { align: "right" }
        );
      }
    }

    // Footer
    doc.setFillColor(...colors.purple);
    doc.rect(0, pageHeight - 12, pageWidth, 12, "F");

    doc.setFont("helvetica", "italic");
    doc.setFontSize(8);
    doc.setTextColor(...colors.white);
    doc.text(
      "Thank you for using our Journey Cost Calculator",
      pageWidth / 2,
      pageHeight - 5,
      { align: "center" }
    );

    // Save the PDF with a custom filename
    doc.save(
      `${
        journeyName ? journeyName.replace(/\s+/g, "-").toLowerCase() : "journey"
      }-costs.pdf`
    );
  };

  return (
    <button
      className="pdf-export-button"
      onClick={generatePDF}
      disabled={!journeyName || !distance || !fuelCost || !mpg}
    >
      Download PDF Summary
    </button>
  );
};

export default PdfExport;
